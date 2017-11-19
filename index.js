var 
  webserver = require('./webserver.js'),
  ctx = {
    'port': 3333,
    'publicFolder': 'public',
    'indexFile':'index.html'
  },
  instance = webserver.start(ctx);
