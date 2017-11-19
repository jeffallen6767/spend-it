// transform pdf's in /data to data in /json
var fs = require('fs'),
  path = require('path'),
  pdf2json = require("pdf2json"),
  basePath = process.cwd(),
  dataPath = path.resolve(basePath, 'data'),
  jsonPath = path.resolve(basePath, 'json'),
  isPdf = function(name) {
    // ie. does the file name end in .pdf ?
    return name.indexOf('.pdf') === (name.length - 4);
  },
  firstDivider = 'dateDescriptionAmount',
  secondDivider = 'Previous Balance',
  createLineItems = function(txt) {
    var parts = txt.split(firstDivider)[1].split(secondDivider)[0].split('\n');
    parts.forEach(function(part, index) {
      console.log(index, part);
    });
    return parts.join('___');
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
          fs.writeFile(
            jsonPath + '/' + file.replace('.pdf', '.txt'),
            createLineItems(
              pdfParser.getRawTextContent()
            )
          );
      });
      pdfParser.loadPDF(dataPath + '/' + file);
    }
  });
});


