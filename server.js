var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');

var dictionary = null;

var dictionaryHandler = (request, response) => {

            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end('OK');

};

const server = http.createServer(dictionaryHandler);

server.listen(80, (err) => {  
  if (err) {
    return console.log('error starting server: ' + err);
  }

  console.log('server is listening on 80');
});
