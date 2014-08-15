var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');

var databaseUrl = "sitesdb";
var collections = ['sites'];
var db = require('mongojs').connect(databaseUrl, collections);

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var sendPublicHtml = function(res, assetUrl){
  fs.readFile(assetUrl, "binary", function(err, file) {
    if (err) {
      console.log(err);
    }
    res.writeHead(200, headers);
    res.end(file);
  });
};

var sendDbHtml = function(res, urlAsset) {
  db.sites.find({name: urlAsset}, function(err, data) {
    res.writeHead(200, headers);
    console.log(data[0].html);
    res.end(data[0].html);
  });
}

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  /* Changes: set a default asset url
  This no longer uses the object we created on archive-helpers but instead
    creates a dynamic pathing from current dir to the asset (url) passed in */
  var assetUrl = undefined;

  // Handle public routes
  if(asset === "/"){
    assetUrl = './web/public/index.html';
    sendPublicHtml(res, assetUrl);
  } else if (asset === '/loading.html') {
    assetUrl = './web/public/loading.html';
    sendPublicHtml(res, assetUrl);

  // Handle db routes
  } else {
    // Check if db url is scraped
    var urlAsset = asset.slice(1);
    archive.isUrlScraped(urlAsset, function(isScraped) {
      if (isScraped) {
        sendDbHtml(res, urlAsset) //Make this function!!
      // If not, 404
      } else {
        res.writeHead(404, headers);
        res.end("404 file not found");
      }
    });
  }
}

var addtoArchive = function(url, res) {
 db.sites.insert({name: url, html: '', isScraped: false}, function(err){
  if(err){
    console.log("something happened");
  }
  console.log('database insert complete')
 });

  exports.serveAssets(res, 'loading.html');
};

var handleGETRequests = function(req, res){
 exports.serveAssets(res, req.url);
};

var handlePOSTRequests = function(req, res){
  // open the sites.txt
  var urlString = "";

  // on 'data' handler
  req.on('data', function(chunk){
    urlString += chunk;
  });

  // on 'end'
  req.on('end', function(){
    var currentUrl = urlString.split('=')[1];
    // check if site is archived
    archive.isUrlInList(currentUrl, function(isInList){
      if(isInList){
        res.writeHead(200, headers);
        res.end("That site already exists in the archives");
      } else {
        addtoArchive(currentUrl, res);
      }
    });
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
