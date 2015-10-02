var http = require('http');
var https = require('https');
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
var deprecate = require('deprecate-me');

module.exports = function(nb) {
  var current = 0;
  var queryList = [];
  var event = new EventEmitter();
  var running = true;
  this.max = (nb !== undefined ? nb : 100);

  this.__defineGetter__('current', function() {
    return current;
  });

  this.__defineGetter__('waiting', function() {
    return queryList.length;
  });

  this.__defineGetter__('alive', function() {
    return running;
  });

  var object = this;
  var execQuery = function(options, data, cb) {
    if (!running)
      return;
    var ended = false;
    ++current;
    if (data) {
      if (!options.headers)
	options.headers = {};
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = data.length;
    }
    var proto = http;
    if (options.protocol
	&& options.protocol == 'https') {
      delete options.protocol;
      proto = https;
    }
    var req = proto.request(options, function(res) {
      if (!ended) {
	event.emit('ready');
	--current;
	ended = true;
      }
      if (!running) {
	object.exit();
	return;
      }
      cb(undefined, res);
    });
    req.on('error', function(e) {
      if (!ended) {
	event.emit('ready');
	--current;
	ended = true;
      }
      if (!running) {
	object.exit();
	return;
      }
      cb(e);
    });
    if (data)
      req.write(data);
    req.end();
  };

  this.request = function(options, data, cb) {
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

  this.query = function(options, data, cb) {
    deprecate({name: 'rp.query', since: '1.5.0', removed: '2.0.0', message: 'You should use rp.request() instead'});
    this.request(options, data, cb);
  }

  this.exit = function() {
    running = false;
    queryList = [];
    current = 0;
    this.max = 0;
  }

  this.live = function() {
    running = true;
  }

  this.end = function() {
    deprecate({name: 'rp.end', since: '1.5.0', removed: '2.0.0', message: 'You should use rp.exit() instead'});
    this.exit();
  }

  event.on('ready', function() {
    if (queryList.length) {
      var query = queryList[0];
      queryList = queryList.slice(1);
      execQuery(query[0], query[1], query[2]);
    }
  });
}
