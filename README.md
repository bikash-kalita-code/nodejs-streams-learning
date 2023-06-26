# Streams
 - Streams are data-handling method and are used to read or write input into output sequentially.
 - Streams are a way to handle reading/writing files, network communications, or any kind of end-to-end information exchange in an efficient way.
 - What makes streams unique, is that instead of a program reading a file into memory all at once like in the traditional way, streams read chunks of data piece by piece, processing its content without keeping it all in memory.
 - This makes streams really powerful when working with large amounts of data, for example, a file size can be larger than your free memory space, making it impossible to read the whole file into the memory in order to process it. That’s where streams come to the rescue! Using streams to process smaller chunks of data, makes it possible to read larger files.
 - *Let’s take a “streaming” services such as YouTube or Netflix for example: these services don’t make you download the video and audio feed all at once. Instead, your browser receives the video as a continuous flow of chunks, allowing the recipients to start watching and/or listening almost immediately.*
 - They also give us the power of ‘composability’ in our code. Designing with composability in mind means several components can be combined in a certain way to produce the same type of result. In Node.js it’s possible to compose powerful pieces of code by piping data to and from other smaller pieces of code, using streams.

### Why Streams?
**Stream** basically provides two major advantages compared to other data handling methods:
1. Memory efficiency: you don’t need to load large amounts of data in memory before you are able to process it
2. Time efficiency: it takes significantly less time to start processing data as soon as you have it, rather than having to wait with processing until the entire payload has been transmitted

Many of the build-in modules in Node implement the streaming interface:

 | Readable Streams                | Writable Streams               |
 | ------------------------------- | ------------------------------ |
 | HTTP responses, on the client   | HTTP requests, on the client   |
 | HTTP requests, on the server    | HTTP responses, on the server  |
 | fs read streams                 | fs write streams               |
 | zlib streams                    | zlib streams                   |
 | crypto streams                  | crypto streams                 |
 | TCP sockets                     | TCP sockets                    |
 | child process stdout and stderr | child process stdin            |
 | process.stdin                   | process.stdout, process.stderr |


4 fundamental streams in Node.js:
1. **Readable:** streams from which data can be read. For example: *fs.createReadStream()* lets us read the contents of a file.
2. **Writable:** streams to which we can write data. For example, *fs.createWriteStream()* lets us write data to a file using streams.
3. **Duplex:** streams that are both Readable and Writable. For example, *net.Socket*
4. **Transform:** streams that can modify or transform the data as it is written and read. For example, in the instance of file-compression, you can write compressed data and read decompressed data to and from a file.

- A **duplex streams** is both Readable and Writable. An example of that is a TCP socket.
- A **transform stream** is basically a duplex stream that can be used to modify or transform the data as it is written and read. An example of that is the `zlib.createGzip` stream to compress the data using gzip. You can think of a transform stream as a function where the input is the writable stream part and the output is readable stream part. You might also hear transform streams referred to as “through streams.”

**NOTE:** All streams are instances of `EventEmitter`. They emit events that can be used to read and write data. However, we can consume streams data in a simpler way using the `pipe` method.

### The pipe method
**`readableSrc.pipe(writableDest)`**

In this simple line, we’re piping the output of a readable stream — the source of data, as the input of a writable stream — the destination. The source has to be a readable stream and the destination has to be a writable one. Of course, they can both be duplex/transform streams as well. In fact, if we’re piping into a duplex stream, we can chain pipe calls just like we do in Linux:
```
readableSrc
  .pipe(transformStream1)
  .pipe(transformStream2)
  .pipe(finalWrtitableDest)
  ```

The pipe method returns the destination stream, which enabled us to do the chaining above. For streams a (readable), b and c (duplex), and d (writable), we can:
```
a.pipe(b).pipe(c).pipe(d)

# Which is equivalent to:
a.pipe(b)
b.pipe(c)
c.pipe(d)

# Which, in Linux, is equivalent to:
$ a | b | c | d
```

The pipe method is the easiest way to consume streams. **It’s generally recommended to either use the `pipe method` or `consume streams with events`, but avoid mixing these two.** Usually when you’re using the pipe method you don’t need to use events, but if you need to consume the streams in more custom ways, events would be the way to go.

### Stream events
Beside reading from a readable stream source and writing to a writable destination, the pipe method automatically manages a few things along the way. For example, it handles errors, end-of-files, and the cases when one stream is slower or faster than the other.

However, streams can also be consumed with events directly. Here’s the simplified event-equivalent code of what the pipe method mainly does to read and write data:

```
# readable.pipe(writable)

readable.on('data', (chunk) => {
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
});
```

Here’s a list of the important events and functions that can be used with readable and writable streams:

#### Readable Streams
**Events**
 - data
 - end
 - error
 - close
 - readable
**Functions**
 - pipe(), unpipe()
 - read(), unshift(), resume()
 - pause(), isPaused()
 - setEncoding()

#### Writable Streams
**Events**
 - drain
 - finish
 - error
 - close
 - pipe/unpipe
**Functions**
 - write()
 - end()
 - cork(), uncork()
 - setDefaultEncoding()


**The most important events on a readable stream are:**

 - The data event, which is emitted whenever the stream passes a chunk of data to the consumer
 - The end event, which is emitted when there is no more data to be consumed from the stream.

**The most important events on a writable stream are:**

 - The drain event, which is a signal that the writable stream can receive more data.
 - The finish event, which is emitted when all data has been flushed to the underlying system.

Events and functions can be combined to make for a custom and optimized use of streams. To consume a readable stream, we can use the `pipe`/`unpipe` methods, or the `read`/`unshift`/`resume` methods. To consume a writable stream, we can make it the destination of `pipe`/`unpipe`, or just write to it with the `write` method and call the `end` method when we’re done.

### Paused and Flowing Modes of Readable Streams
Readable streams have two main modes that affect the way we can consume them:
 - They can be either in the **paused** mode
 - Or in the **flowing** mode
Those modes are sometimes referred to as pull and push modes.

All readable streams start in the paused mode by default but they can be easily switched to flowing and back to paused when needed. Sometimes, the switching happens automatically.

When a readable stream is in the paused mode, we can use the `read()` method to read from the stream on demand, however, for a readable stream in the flowing mode, the data is continuously flowing and we have to listen to events to consume it.

In the flowing mode, data can actually be lost if no consumers are available to handle it. This is why, when we have a readable stream in flowing mode, we need a `data` event handler. In fact, just adding a `data` event handler switches a paused stream into flowing mode and removing the `data` event handler switches the stream back to paused mode. Some of this is done for backward compatibility with the older Node streams interface.

To manually switch between these two stream modes, you can use the `resume()` and `pause()` methods.

Readable Streams:

Paused(stream.read) --------- stream.resume() ------> Flowing(EventEmitter)\
Paused(stream.read) <-------- stream.pause() -------- Flowing(EventEmitter)

When consuming readable streams using the pipe method, we don’t have to worry about these modes as pipe manages them automatically.

### Implementing Streams
When we talk about streams in Node.js, there are two main different tasks:

 - The task of `implementing` the streams.
 - The task of `consuming` them.

### Implementing a Writable Stream

```
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
```

### Implementing a Readable Stream
#### Source: https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
```
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
```

We’re basically pushing all the data in the stream before piping it to `process.stdout`. The much better way is to push data on demand, when a consumer asks for it. We can do that by implementing the `read()` method in the configuration object:

```
const inStream = new Readable({
  read(size) {
    // there is a demand on the data... Someone wants to read it.
  }
});
```

When the read method is called on a readable stream, the implementation can push partial data to the queue. For example, we can push one letter at a time, starting with character code 65 (which represents A), and incrementing that on every push:

```
const { Readable } = require("stream");
const inStream = new Readable({
  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  },
});
inStream.currentCharCode = 65;
inStream.pipe(process.stdout);
```

While the consumer is reading a readable stream, the read method will continue to fire, and we’ll push more letters. We need to stop this cycle somewhere, and that’s why an if statement to push null when the currentCharCode is greater than 90 (which represents Z).

#### Source: https://nodesource.com/blog/understanding-streams-in-nodejs/
```
const Stream = require("stream");
const readableStream = new Stream.Readable({
  read() {},
});
readableStream.push("ping!");
readableStream.push("pong!");
readableStream.pipe(process.stdout);
```

### async iterator
**It’s highly recommended to use async iterator when working with streams.** According to Dr. Axel Rauschmayer, Asynchronous iteration is a protocol for retrieving the contents of a data container asynchronously (meaning the current “task” may be paused before retrieving an item). Also, it’s important to mention that the stream async iterator implementation use the ‘readable’ event inside.
```
import * as fs from "fs";
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
    await sleep(1000);
    break;
  }
  console.log('Done');
}
const readable = fs.createReadStream("./DAC_NationalDownloadableFile.csv", {
  encoding: "utf8",
});
logChunks(readable);
```

```
// It’s also possible to collect the contents of a readable stream in a string:

import { Readable } from "stream";

async function readableToString2(readable) {
  let result = "";
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

const readable = Readable.from("Good morning!", { encoding: "utf8" });
console.log(await readableToString2(readable) === "Good morning!"); // true
readable.pipe(process.stdout);
```

### Implementing Duplex/Transform Streams

With Duplex streams, we can implement both readable and writable streams with the same object. It’s as if we inherit from both interfaces.

Example of `duplex stream` that combines the two writable and readable examples implemented above:
```
const { Duplex } = require('stream');

const inoutStream = new Duplex({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    },

    read(size) {
        this.push(String.fromCharCode(this.currentCharCode++));
        if(this.currentCharCode > 90) {
            this.push(null);
        }
    }
});
inoutStream.currentCharCode = 65;
process.stdin.pipe(inoutStream).pipe(process.stdout);
```
By combining the methods, we can use this duplex stream to read the letters from A to Z and we can also use it for its echo feature. We pipe the readable stdin stream into this duplex stream to use the echo feature and we pipe the duplex stream itself into the writable stdout stream to see the letters A through Z.

It’s important to understand that the readable and writable sides of a duplex stream operate completely independently from one another. This is merely a grouping of two features into an object.

**A transform stream is the more interesting duplex stream because its output is computed from its input.**

**For a transform stream, we don’t have to implement the read or write methods, we only need to implement a transform method, which combines both of them. It has the signature of the write method and we can use it to push data as well.**

```
// Here’s a simple transform stream which echoes back anything you type into it after transforming it to upper case format:
const { Transform } = require('stream');

const upperCaseTr = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

process.stdin.pipe(upperCaseTr).pipe(process.stdout);
```

### Streams Object Mode
By default, streams expect Buffer/String values. There is an `objectMode` flag that we can set to have the stream accept any JavaScript object.

Here’s a simple example to demonstrate that. The following combination of transform streams makes for a feature to map a string of comma-separated values into a JavaScript object. So “a,b,c,d” becomes {a: b, c: d}.

```
const { Transform } = require("stream");

const commaSplitter = new Transform({
  // Adding the readableObjectMode flag on that stream is necessary because we’re pushing an object there, not a string.
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(","));
    callback();
  },
});

const arrayToObject = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    const obj = {};
    for (let i = 0; i < chunk.length; i += 2) {
      obj[chunk[i]] = chunk[i + 1];
    }
    this.push(obj);
    callback();
  },
});

const objectToString = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + "\n");
    callback();
  },
});

process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout);

```

### Node's build-in transform streams
Node has a few very useful built-in transform streams. Namely, the **zlib** and **crypto streams**.

Here’s an example that uses the zlib.createGzip() stream combined with the fs readable/writable streams to create a file-compression script:

```
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
.pipe(zlib.createGzip())
.pipe(fs.createWriteStream(file+'.gz'));
```

The cool thing about using pipes is that we can actually combine them with events if we need to. Say, for example, I want the user to see a progress indicator while the script is working and a “Done” message when the script is done. Since the pipe method returns the destination stream, we can chain the registration of events handlers as well:

```
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
.pipe(zlib.createGzip)
.on('data', () => process.stdout.write('.'))
.pipe(fs.createWriteStream(file+'.zz'))
.on('finish', () => console.log('Done'));
```

What’s great about the pipe method though is that we can use it to compose our program piece by piece, in a much readable way. For example, instead of listening to the data event above, we can simply create a transform stream to report progress, and replace the .on() call with another .pipe() call:

```
const fs = require("fs");
const zlib = require("zlib");
const file = process.argv[2];

const { Transform } = require("stream");

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write(".");
    callback(null, chunk);
  },
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + ".zz"))
  .on("finish", () => console.log("Done"));
```

**Note** how I used the second argument in the callback() function to push the data inside the transform() method. This is equivalent to pushing the data first.

If we need to encrypt the file before or after we gzip it, all we need to do is pipe another transform stream in that exact order that we needed. We can use Node’s crypto module for that:
```
const crypto = require('crypto');
// ...

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipher('aes192', 'a_secret'))
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.zz'))
  .on('finish', () => console.log('Done'));
```

To actually be able to unzip anything zipped with the script above, we need to use the opposite streams for crypto and zlib in a reverse order, which is simple:

```
fs.createReadStream(file)
  .pipe(crypto.createDecipher('aes192', 'a_secret'))
  .pipe(zlib.createGunzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file.slice(0, -3)))
  .on('finish', () => console.log('Done'));
```

### Resources
 - [https://nodesource.com/blog/understanding-streams-in-nodejs/](https://nodesource.com/blog/understanding-streams-in-nodejs/)
 - [https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)