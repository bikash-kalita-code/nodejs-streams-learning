// It’s also possible to collect the contents of a readable stream in a string:

import { Readable } from "stream";

async function readableToString2(readable) {
  let result = "";
  for await (const chunk of readable) {
    console.log(chunk);
    result += chunk;
  }
  return result;
}

const readable = Readable.from("Good morning!\nNew Line\nNew Line 2", { encoding: "utf8" });
console.log(await readableToString2(readable) === "Good morning!"); // true
readable.pipe(process.stdout);