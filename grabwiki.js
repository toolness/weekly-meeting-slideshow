// This is a node.js script that sets up a cross-origin XHR
// endpoint allowing any webpage to obtain the rendered HTML
// content for any Wiki page on wiki.mozilla.org.

var http = require('http');
var https = require('https');
const WIKI_DOMAIN = 'wiki.mozilla.org';

http.createServer(function(req, res) {
  var parts = require('url').parse(req.url);
  var title = encodeURIComponent(parts.pathname.slice(1));

  var wikiReq = https.get({
    host: WIKI_DOMAIN,
    path: '/index.php?title=' + title + '&action=render'
  }, function(wikiRes) {
    res.writeHead(wikiRes.statusCode, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    wikiRes.on('data', function(chunk) {
      res.write(chunk);
    });
    wikiRes.on('end', function() {
      res.end();
    });    
  });

  wikiReq.on('error', function(ex) {
    console.log("Error when fetching " + req.url);
    console.log(ex.stack);
  });
}).listen(8291);
