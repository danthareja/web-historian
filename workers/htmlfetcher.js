// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');
var path = require('path');

// Check sites.txt for new sites
// scrape html of each site
// save in sites/*sitename*

exports.fetch = function() {
  // Read list of urls in sites.txt
  archive.readListOfUrls(function(urlArray){
    // Iterate over each url in the list
    urlArray.forEach(function(urlItem){
      // If url is not blank (last item in sites.txt file is always blank)
      if (urlItem !== "") {
        // Check if the current url is archived
        archive.isURLArchived(urlItem, function(isArchived){
          // If not, archived:
          if(!isArchived){
            // Scrape the file:
            request('http://' + urlItem, function(err, res, html) {
              // Write the contents of the scrape to /archives/sites (a new file will be created with the url name)
              fs.writeFile(path.join(__dirname, '../archives/sites/', urlItem), html, function(err) {
                if (err) {console.log(err);}
              });
            });
          }
        });
      }
    });
  });
};




