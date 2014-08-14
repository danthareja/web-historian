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
  var assetUrl;
  if(asset === "/"){
    assetUrl = './web/public/index.html';
  } else {
    assetUrl = path.join(__dirname, '../archives/sites/', asset);
  }
  if(asset) {
    fs.readFile(assetUrl, "binary", function(err, file) {
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

var addtoArchive = function(url, res) {
  // if not, add it to archive list
  fs.appendFile(archive.paths.list, url + '\n', function(err){
    if(err){
      console.log(err);
    } else {
      console.log(url, 'Added to sites.txt')
    }
  });
  // adding the currentUrl from POST request to the archives URL list
  archive.urlList['/' + url] = './archives/sites/' + url;
  exports.serveAssets(res, './web/public/loading.html');
}

var handleGETRequests = function(req, res){
  //var archiveUrl = archive.urlList[req.url];
  // if(req.headers['referer']){
  //   var hostname = req.headers['referer'].split('8080/')[1];
  //   archiveUrl = "http://" + hostname + req.url;
  //   res.writeHead(302, {'Location': archiveUrl});
  //   res.end();
  // } else {
  //  exports.serveAssets(res, archiveUrl);
   exports.serveAssets(res, req.url);
  // }
};

var handlePOSTRequests = function(req, res){
  // open the sites.txt
  var urlString = "";

  // on 'data' handler
  req.on('data', function(chunk){
    // var += data
    urlString += chunk;
  });

  // on 'end'
  req.on('end', function(){
    var currentUrl = urlString.split('=')[1];
    // check if site is archived
    if ( archive.urlList['/' + currentUrl] ) {
      res.writeHead(200, headers);
      res.end("That site already exists in the archives");
      // exports.serveAssets(res, archive.urlList['/' + currentUrl]);
    } else {
      addtoArchive(currentUrl, res);
    }
  });
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
