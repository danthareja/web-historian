var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log("Serving ", req.method, " for url ", req.url);
  helpers.requestMap[req.method](req, res);

  // helpers.requestMap[req.method](req, res);
  // res.end(archive.paths.list);
};
