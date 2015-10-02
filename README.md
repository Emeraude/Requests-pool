# Requests-Pool

A simple node module to make http requests using a pool.  
It'll allow you to limit your requests to avoid the crash of distant server when you're crawling.

## Usage

```javascript
var Rp = require('requests-pool');
var rp = new Rp(100);

rp.query(options, datas, function(errors, res) {
	if (errors)
		throw errors;
});
```

It's using the http.request() node method, so **errors** will be the error throwed by this method and **res** the object send to the callback of this object. **options** are the options sent as the first argument of thie method.  
**datas** are the datas you want to send if you are doing a **POST** request.

## Documentation
### new rp(max)

**max** is the number of maximum simultaneous requests. Default value is **100**.

### rp.max

A getter/setter for the number of maximum simultaneous requests.

### rp.current

A getter for the number of current requests.

### rp.waiting

A getter for the number of waiting requests.

### rp.alive

A getter to know if the request pool is alive. If *false*, no more requests can be added.

### rp.query(options[, data], cb)

**options** is the same argument as passed to http.request() native method.  
**data** is the data sent used in a **POST** request. If not null, the header fields `Content-Type` and `Content-Length` will be automatically filled.  
**cb** is a callback that take two arguments: the error (or *undefined*) and the **res** object getted by the callback of the http.request() method (or *undefined* if an error occur).  
If you want to use *https*, you need to set `options.protocol` to *'https'*

### rp.exit()

Remove all the current pending requests and no more can be added.

### rp.live()

May be used after `rp.exit` to make the request pool re-usable.

### Authors

Emeraude
