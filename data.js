// transform pdf's in /data to data in /json
var fs = require('fs'),
  path = require('path'),
  pdf2json = require("pdf2json"),
  basePath = process.cwd(),
  dataPath = path.resolve(basePath, 'data'),
  jsonPath = path.resolve(basePath, 'json'),
  isPdf = function isPdf(name) {
    // ie. does the file name end in .pdf ?
    return name.indexOf('.pdf') === (name.length - 4);
  },
  firstDivider = 'dateDescriptionAmount',
  secondDivider = 'Previous Balance',
  thirdDivider = 'Total fees charged in',
  newline = '\r\n',
  doubleDateRe = /^(\d{2}\/\d{2})(\d{2}\/\d{2})/, // match "09/3009/30"
  singleDateRe = /^(\d{2}\/\d{2})/, // match "09/30"
  whiteSpace = /\s+/g, // match one or more whitespace characters globally
  parseDataRows = function parseData(txt) {
    return txt.split(firstDivider)[1].split(secondDivider)[0].split(thirdDivider)[0].split(newline);
  },
  createJson = function createJson(rows) {
    var data = [];
    rows.forEach(function(raw, index) {
      var row = raw.trim();
      console.log(index, row);
      if (row != '') {
        data.push(
          parseRow(row)
        );
      }
    });
    return {"data": data};
  },
  removeCommas = function removeCommas(txt) {
    return txt.replace(/,/g, '');
  },
  parseRow = function parseRow(row) {
    var 
      negative = row.split('-$'),
      positive = negative.length == 1 ? row.split('$') : [],
      isPositive = positive.length == 2,
      amount = isPositive ? removeCommas(positive[1]) - 0 : removeCommas(negative[1]) * (-1),
      temp = isPositive ? positive[0] : negative[0],
      doubleDate = doubleDateRe.exec(temp),
      singleDate = !doubleDate && singleDateRe.exec(temp),
      dates = singleDate ? [singleDate[0], singleDate[0]] : [doubleDate[1], doubleDate[2]],
      labelRaw = singleDate ? temp.replace(singleDateRe, '') : temp.replace(doubleDateRe, ''),
      label = labelRaw.replace(whiteSpace, ' '),
      parsed = {
        //"raw": row,
        "amount": amount,
        "dates": dates,
        "label": label,
        /*
        "temp": temp,
        "doubleDate": doubleDate,
        "singleDate": singleDate,
        */
      };
    
    return parsed;
  },
  jsonText = function jsonText(json) {
    return JSON.stringify(json);
  },
  paths = [

  ].map(function(part) {
    return path.resolve(basePath, part);
  });

// write
//fs.writeFileSync("./public/vendor/js/_.js", wrapped);

// run pdf2json:
fs.readdir(dataPath, function(err, files) {
  files.forEach(function(file) {
    var pdf = isPdf(file),
      pdfParser;
    if (pdf) {
      console.log("pdf2json", file);
      pdfParser = new pdf2json(this, true);
      pdfParser.on("pdfParser_dataError", function(errData) {
        console.error(errData.parserError)
      });
      pdfParser.on("pdfParser_dataReady", function(pdfData) {
        var txt = pdfParser.getRawTextContent();
        fs.writeFile(
          jsonPath + '/' + file.replace('.pdf', '.txt'),
          txt
        );
        
        fs.writeFile(
          jsonPath + '/' + file.replace('.pdf', '.json'),
          jsonText(
            createJson(
              parseDataRows(
                txt
              )
            )
          )
        );
      });
      pdfParser.loadPDF(dataPath + '/' + file);
    }
  });
});


