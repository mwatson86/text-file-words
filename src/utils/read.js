
import path from 'path';
import fs from 'fs';

// file path
export const filePath = path.resolve(__dirname, '..', 'file.txt');

// read, returns promise
export const read = (resolve, reject) => {
  // set data to empty string
  let data = '';

  // create read stream, passing in file path
  const rstream = fs.createReadStream(filePath);

  // on data, add chunk
  rstream.on('data', chunk => data += chunk);

  // error handing, reject promise
  rstream.on('error', err => reject(err));

  // on end, resolve promise
  rstream.on('end', () => resolve(data));
};

// default export
export default () => new Promise(read);
