var http = require('http');
var fs = require('fs');

// create a read stream from a txt file, encoded with utf8
var myReadStream = fs.createReadStream(__dirname + '/readme.txt', 'utf8');

// listen for event 'data' on the readstream
myReadStream.on('data', function(chunk){
    console.log('new chunk  recieved');
    console.log(chunk);
})



// var server = http.createServer(function(req, resp){
//     console.log('request was made: ' + req.url) // log information on our server
//     resp.writeHead(200, {'Content-Type': 'text/plain'}); //Send back the header
//     resp.end('Hey ninjas'); //Send back response body
// });

// server.listen(3000, '127.0.0.1')
// console.log('yo dawgs, now listening to port 3000!')

// // data flows into the buffer
// // when the buffer reaches capacity it passes on a chunk of data as a stream