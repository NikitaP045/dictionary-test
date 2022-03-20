var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');

var dictionary = null;

try{
  

var dictionaryHandler = (request, response) => {
    var u = url.parse(decodeURI(request.url));
    //console.log(u);
    if (u.pathname == '/readyz') {
        if (dictionary) {
            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end('OK');
        } else {
            response.writeHead(404);
            response.end('Not Loaded');
        }
        return;
    }
    
        if (u.pathname == '/info') {
        fs.readFile(__dirname + '/graph.png', function (err, content) {
            if (err) {
                response.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                response.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                response.writeHead(200,{'Content-type':'image/png'});
                response.end(content);
            }
    });

          return;
      }

    var key = '';
    if (u.pathname.length > 0) {
        //console.log(u);
        key = u.pathname.substr(1);
    }
    var def = dictionary[key];
    if (!def) {
        response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end(key + ' was not found');
        return;
    }
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end(def);
}

var downloadDictionary = (url, file, callback) => {
  var stream = fs.createWriteStream(file);
  var req = https.get(url, function(res) {
    res.pipe(stream);
    stream.on('finish', function() {
      stream.close(callback);
      console.log('dictionary downloaded');
    });
  }).on('error', function(err) {
    fs.unlink(file);
    if (callback) cb(err.message);
  });
};

var loadDictionary = (file, callback) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        dictionary = JSON.parse(data);
        console.log('dictionary loaded.');
        callback();
    })
};

downloadDictionary('https://raw.githubusercontent.com/NikitaP045/dictionary-test/main/dictionary.json', 'dictionary.json', (err) => {
    if (err) {
        console.log(err);
        return;
    }
    loadDictionary('dictionary.json', (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('ready to serve');
    });
});
}catch(e){
  console.error(e)
}
  
const server = http.createServer(dictionaryHandler);

server.listen(80, (err) => {  
  if (err) {
    return console.log('error starting server: ' + err);
  }

  console.log('server is listening on 80');
});
