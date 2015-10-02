#!/usr/bin/env node

var Rp = require('./lib');
var rp = new Rp(2);
var ids = [1337, 1338, 1339];

for (i in ids) {
  console.log(rp.current + '/' + rp.max + '(' + rp.waiting + ')');
  rp.request({host: 'broggit.me', path: '/quote/' + ids[i], port: 3001, method: 'GET'}, function(e, res) {
    if (res.statusCode != 200) {
      console.error(res.statusCode + ': ' + res.statusMessage);
      process.exit(1);
    }
    var quote = '';
    res.on('data', function(d) {
      quote += d;
    }).on('end', function() {
      console.log(quote);
    });
    console.log(rp.current + '/' + rp.max + '(' + rp.waiting + ')');
  });
  console.log(rp.current + '/' + rp.max + '(' + rp.waiting + ')');
}

for (i = 0; i < 100; ++i) {
  console.log(rp.current + '/' + rp.max + '(' + rp.waiting + ')');
  j = 0;
  rp.request({host: 'broggit.me', path: '/quote/' + i, port: 3001, method: 'GET'}, function(e, res) {
    ++j;
    console.log(j);
    if (j == 10) {
      console.log('alive: ' + rp.alive);
      rp.exit();
      console.log('alive: ' + rp.alive);
    }
    console.log(rp.current + '/' + rp.max + '(' + rp.waiting + ')');
    if (!rp.alive) {
      rp.live();
      console.log('alive: ' + rp.alive);
    }
  });
}
