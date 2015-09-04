#!/usr/bin/env node

var Rp = require('./lib');
var rp = new Rp();

console.log(rp.current + '/' + rp.max);
rp.query({host: 'broggit.me', path: '/quote/1337', port: 3001, method: 'GET'}, function(e, res) {
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
  console.log(rp.current + '/' + rp.max);
});
console.log(rp.current + '/' + rp.max);
