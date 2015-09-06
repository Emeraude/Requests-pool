var http = require('http');
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;

module.exports = function(nb) {
  var current = 0;
  var queryList = [];
  var event = new EventEmitter();
  this.max = (nb !== undefined ? nb : 100);

  this.__defineGetter__('current', function() {
    return current;
  });

  this.__defineGetter__('waiting', function() {
    return queryList.length;
  });

  var execQuery = function(options, data, cb) {
    var ended = false;
    ++current;
    var req = http.request(options, function(res) {
      if (!ended) {
	event.emit('ready');
	--current;
	ended = true;
      }
      cb(undefined, res);
    });
    req.on('error', function(e) {
      if (!ended) {
	event.emit('ready');
	--current;
	ended = true;
      }
      cb(e);
    });
    if (data)
      req.write(data);
    req.end();
  };

  this.query = function(options, data, cb) {
    if (cb == undefined) {
      cb = data;
      data = undefined;
    }
    if (typeof data == 'object')
      data = querystring.stringify(data);
    if (current < this.max)
      execQuery(options, data, cb);
    else
      queryList.push([options, data, cb]);
  }

  event.on('ready', function() {
    if (queryList.length) {
      var query = queryList[0];
      queryList = queryList.slice(1);
      execQuery(query[0], query[1], query[2]);
    }
  });
}
