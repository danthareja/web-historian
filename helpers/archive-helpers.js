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

// eventually path these links out
exports.urlList = {
  '/': './web/public/index.html',
  '/www.google.com': './archives/sites/www.google.com'
};

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

exports.readListOfUrls = function(callback){
  var urls = [];
  fs.readFile(exports.paths.list, function(err, data){
    urls = data.toString().split("\n");
    console.log(urls.length-1);
    callback(urls.slice(0, urls.length));
  });
};

exports.isUrlInList = function(){
};

exports.addUrlToList = function(){
};

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

htmlfetcher.fetch();

exports.downloadUrls = function(){
};
