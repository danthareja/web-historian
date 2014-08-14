// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');
var path = require('path');

// Check sites.txt for new sites
// scrape html of each site
// save in sites/*sitename*

// readListOfUrls
exports.fetch = function() {
  archive.readListOfUrls(function(urlArray){
    console.log('in readlist, urlArray is ')
    urlArray.forEach(function(urlItem){
      console.log('in for each, item is: ', urlItem);
      archive.isURLArchived(urlItem, function(isArchived){
        if(!isArchived){
          console.log(urlItem);
          console.log(path.join(__dirname, '../archives/sites/', urlItem));
          request('http://' + urlItem, function(err, res, html) {
            fs.writeFile(path.join(__dirname, '../archives/sites/', urlItem), html, function(err) {
              if (err) {console.log(err);}
            });
          });
          // .pipe(fs.createWriteStream(path.join(__dirname, '../archives/sites/', urlItem)));
        }
      });
    });
  });
};
  // in the callback (which is an array of the sites.txt file)
    // for each url in that array, call isURLArchived (passing in current url)
      // in that callback
        // if false, request => pipe => file


/*        request('http://www.google.com', function(err, res, html){
          console.log("html: ", html);  // scraper data
        });
*/




