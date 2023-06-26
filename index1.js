// Creating a readable stream

const Stream = require("stream");
const readableStream = new Stream.Readable({
  read() {},
});
readableStream.push("ping!");
readableStream.push("pong!");
readableStream.pipe(process.stdout);
