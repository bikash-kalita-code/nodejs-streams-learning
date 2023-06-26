// Simple node server to serve big files
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    fs.readFile('./big.file', (err, data) => {
        if(err) throw err;
        res.end(data);
    })
});

server.listen(8000);

// We basically put the whole big.file content in memory before we wrote it out to the response object. 
// This is very inefficient.

// The HTTP response object (res in the code above) is also a writable stream. 
// This means if we have a readable stream that represents the content of big.file, we can just pipe those two on each other and achieve mostly the same result without consuming ~400 MB of memory.