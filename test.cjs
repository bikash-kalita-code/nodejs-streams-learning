/**
 * ALGORITHM:
 * 1. Take a chunk
 * 1.1 Split it on '\n' and name it as splitChunkArray
 * 1.1.1 Iterate through all the splitChunkArray and name it as rowChunk
 * 1.1.2 Split rowChunk on ',' and name it as rowChunkSplitArray
 * 1.1.2.1 If length of rowChunkSplitArray is same as number of columns:
 *            insert into postgres
 *         Else if rowChunkSplitArray is last element push to lastBuffer
 *         else throw error
 * ...
 */

// import * as fs from "fs";
// import * as pg from "pg";

const fs = require('fs');
const { Pool } = require('pg')

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "medicare",
  password: "morning8",
  port: 5432,
};

const pool = new Pool(credentials);

async function insertRow(row) {
  const query = {
    text: "INSERT INTO doctorsandcliniciansnationaldownloadablefile (npi, ind_pac_id, ind_enrl_id, lst_nm, frst_nm, mid_nm, suff, gndr, cred, med_sch, grd_yr, pri_spec, sec_spec_1, sec_spec_2, sec_spec_3, sec_spec_4, sec_spec_all, telehlth, org_nm, org_pac_id, num_org_mem, adr_ln_1, adr_ln_2, ln_2_sprs, cty, st, zip, phn_numbr, ind_assgn, grp_assgn, adrs_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)",
    values: row,
  };
  await pool
    .query(query)
    .then(() => {
      // TODO: Stataments to be executed on successful execution of a query
    })
    .catch((error) => {
      console.error("Error inserting row " + count, error);
      process.exit(1);
    });
}

const commaReplacementString = "COMMAREPLACEMENTTEXT";

let rowCount = 0;

async function logChunks(readable, numberOfColumns) {
  try {
    let pending = "";
    for await (const chunk of readable) {
      pending = pending + chunk;
      const splitChunkArray = pending.split("\n");
      for (let row of splitChunkArray) {
        if (row === "") continue;
        // TODO: REPLACEMENT COMMA INSIDE ""(DOUBLE QUOTES) WITH commaReplacementText USING REGULAR EXPRESSION
        const columnsDataWithCommaArray = row.match(/"[\w\W]*?"/gi);
        // console.log(columnsDataWithCommaArray);
        if (columnsDataWithCommaArray) {
          for (let columnData of columnsDataWithCommaArray) {
            const temp = columnData.replaceAll(",", commaReplacementString);
            row = row.replaceAll(columnData, temp);
          }
        }
        const rowSplitArray = row.split(",");
        // console.log(rowSplitArray);
        // console.log(rowSplitArray.length);
        if (numberOfColumns === rowSplitArray.length) {
          // console.log(true);
          // TODO: Insert data into postgres database
          rowSplitArray[rowSplitArray.length-1] = rowSplitArray[rowSplitArray.length-1].replaceAll('\r', '');
          for(let i=0; i<rowSplitArray.length; i++) {
            rowSplitArray[i] = rowSplitArray[i].replaceAll(commaReplacementString, ',');
          }
          // console.log(rowSplitArray);
          await insertRow(rowSplitArray);
          rowCount++;
          console.log('Inserted number of rows : ' + rowCount);
        } else {
          // console.log(false);
          pending = rowSplitArray.join(",");
          // console.log(pending);
        }
        // TODO: If chunk matches target length, then operate on it
      }
      // TODO: Remove break. Its for experimental purpose
      // await sleep(4000);
      // count++;
      // if(count>2) {
      //   break;
      // }
    }
    console.log("DONE");
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
  // for await (const chunk of readable) {
  //   const chunkSplitUsingNewline = chunk.split('\n');
  //   console.log(chunk);
  //   const splitLength = chunkSplitUsingNewline.length;
  //   console.log(splitLength);
  //   console.log('-2 : ' + chunkSplitUsingNewline[splitLength-2]);
  //   console.log('-1 : ' + chunkSplitUsingNewline[splitLength-1]);
  //   // await sleep(1000);
  //   break;
  // }
  // console.log('Done');
  // process.exit(0);
}
const readable = fs.createReadStream("./DAC_NationalDownloadableFile.csv", {
  encoding: "utf8",
});
logChunks(readable, 31);
console.log("Rows iterated : " + rowCount);
