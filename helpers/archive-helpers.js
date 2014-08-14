var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlfetcher = require('../workers/htmlfetcher');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// Reads urls and passes array of urls to callback
exports.readListOfUrls = function(callback){
  var urls = [];
  // Looking in directory /archives/sites.txt for all files
  fs.readFile(exports.paths.list, function(err, data){
    // transform string of sites to array
    urls = data.toString().split("\n");
    callback(urls.slice(0, urls.length));
  });
};

// Checks if any given url is in /archives/sites.txt and passes true or false to callback
exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(urlList){
    if(urlList.indexOf(url) < 0){
      callback(false);
    } else {
      callback(true);
    }
  })
};

exports.addUrlToList = function(){
};

// Checks if any given url has been archived in /archives/sites and passes true or false to callback
exports.isURLArchived = function(url, callback){
  fs.readdir( path.join(__dirname, '../archives/sites' ), function(err, arr){
    var isArchived = false;
    arr.forEach(function(site){
      if(site === url){
        isArchived = true;
      }
    });
    callback(isArchived);
  });
};

/************** Note: This is currently what's calling our fetch function */
htmlfetcher.fetch();

exports.downloadUrls = function(){
};
