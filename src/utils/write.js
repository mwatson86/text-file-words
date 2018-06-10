
import fetch from 'node-fetch';

import path from 'path';
import fs from 'fs';

// file path
export const filePath = path.resolve(__dirname, '..', 'file.txt');

// external text tile url
export const externalTextFile = 'http://www.loyalbooks.com/download/text/Railway-Children-by-E-Nesbit.txt';

// check if file exists, returns boolean
export const fileExists = () => {
  try {

    // sync existence check
    fs.accessSync(filePath);

    return true;
  } catch (err) {
    return false;
  }
};

// write, returns promise
const write = resp => new Promise((resolve, reject) => {

  // create write stream
  const wstream = fs.createWriteStream(filePath);

  // pipe data from resp.body into wstream
  resp.body.pipe(wstream);

  // error handing, reject promise
  resp.body.on('error', err => reject(err));

  // on end, resolve promise
  resp.body.on('end', () => resolve());
});

// default export
export default () => {

  // check if file does exists
  if (!fileExists()) {

    // if file does not exist, fetch file, then write
    return fetch(externalTextFile).then(write);
  }

  // resolve promise
  return Promise.resolve();
};
