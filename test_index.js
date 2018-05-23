var express = require('express');
var index = require(__dirname + '/index.js');

var app = express();

app.post('/', index.CompasCard);

app.listen(3000);
console.log('listening on port 3000...')