// To implement a writable stream, we need to to use the Writable constructor from the stream module.
const { Writable } = require("stream");

// We can implement a writable stream in many ways.
// We can, for example, extend the Writable constructor if we want
// class myWritableStream extends Writable {
//
// }

const outStream = new Writable({
  // The 'chunk' method is usually a buffer unless we configure the stream differently
  // The 'encoding' argument is needed in that case, but usually we ignore it
  // The 'callback' is a function that we need to call after we're done processing the data chunk
  // It's what signals whether the write was successful or not.
  // To signal a failure, call the callback with an error object
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },
});

process.stdin.pipe(outStream);