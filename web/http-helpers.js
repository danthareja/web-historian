var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};

var serveHTML = function(req, res) {
  // var newPath = path.resolve(".", "web/public/index.html");
  // console.log(newPath);
  fs.readFile('./web/public/index.html', "binary", function(err, file) {
    if (err) {
      console.log(err);
    }

    console.log("buffer to string: ", file);
    res.writeHead(200, headers);
    res.end(file);
  });

};

var handleGETRequests = function(req, res){
  res.writeHead(200, headers);
  if(req.url === "/") {
    // serve up index.html
    serveHTML(req, res);
  } else {
  res.end();
  }
 // should eventually be html of request url
}

var handlePOSTRequests = function(req, res){
  res.writeHead(200, headers);
  res.end(); // should eventually be html of request url
}

var handleOPTIONSRequests = function(req, res){
  res.writeHead(200, headers);
  res.end(); // should eventually be html of request url
}

exports.requestMap = {
  'GET': handleGETRequests,
  'POST': handlePOSTRequests,
  'OPTIONS': handleOPTIONSRequests
};

// As you progress, keep thinking about what helper functions you can put here!
