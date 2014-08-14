var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url')

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

  if(asset) {
    fs.readFile(asset, "binary", function(err, file) {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, headers);
      res.end(file);
    });
  } else {
    res.writeHead(404, headers);
    res.end();
  }
};

var handleGETRequests = function(req, res){
  var archiveUrl = archive.urlList[req.url];
  if(req.headers['referer']){
    var hostname = req.headers['referer'].split('8080/')[1];
    archiveUrl = "http://" + hostname + req.url;
    res.writeHead(302, {'Location': archiveUrl});
    res.end();
  } else {
    exports.serveAssets(res, archiveUrl);
  }
};

var handlePOSTRequests = function(req, res){
  res.writeHead(200, headers);
  res.end(); // should eventually be html of request url
};

var handleOPTIONSRequests = function(req, res){
  res.writeHead(200, headers);
  res.end(); // should eventually be html of request url
};

exports.requestMap = {
  'GET': handleGETRequests,
  'POST': handlePOSTRequests,
  'OPTIONS': handleOPTIONSRequests
};

// As you progress, keep thinking about what helper functions you can put here!
