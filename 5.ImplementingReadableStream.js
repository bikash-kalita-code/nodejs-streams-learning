// To implement a readable stream, we require the Readable interface, and construct an object from it, 
// and implement a read() method in the stream’s configuration parameter:

const { Readable } = require('stream');

const inStream = new Readable({
    read(){}
});

inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');

inStream.push(null); // No more data

inStream.pipe(process.stdout);

// When we `push` a `null` object, that means we want to signal that the stream does not have any more data.
