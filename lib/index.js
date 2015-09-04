var http = require('http');
var querystring = require('querystring');

module.exports = function(nb) {
  var current = 0;
  this.max = nb || 100;

  this.__defineGetter__("current", function() {
    return current;
  });

  this.query = function(options, data, cb) {
    if (cb == undefined) {
      cb = data;
      data = undefined;
    }
    if (typeof data == 'object')
      data = querystring.stringify(data);
    if (current < this.max) {
      var ended = false;
      ++current;
      var req = http.request(options, function(res) {
	if (!ended) {
	  --current;
	  ended = true;
	}
	cb(undefined, res);
      });
      req.on('error', function(e) {
	if (!ended) {
	  --current;
	  ended = true;
	}
	cb(e);
      });
      if (data)
	req.write(data);
      req.end();
    }
  }
}
