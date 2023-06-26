// async iterator

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
