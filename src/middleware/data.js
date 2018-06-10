
import write from 'utils/write';
import read from 'utils/read';

import * as helpers from 'helpers';

// is num prime
export const isPrime = (num) => {
  // starts at 2, as every number is a factor of 1
  for (let i = 2; i < num; i++) {
    // check if the remainder is 0
    if (num % i === 0) {
      return false;
    }
  }

  // check if the num if not equal to 1
  return num !== 1;
};

// map isPrime value
export const mapPrimeValue = (word) => Object.assign({}, word, {
  isPrime: isPrime(word.count)
});

// map words into mapPrimeValue
export const mapPrimeValues = (words) => words.map(mapPrimeValue);

// match word against word contained in obj
export const matchWord = (obj, word) => obj.word === word;

// find the index of word in accumulator
export const getIndexOfWord = (accumulator, word) => accumulator.findIndex(obj => matchWord(obj, word));

// map word, incrementing the count if already exists
export const mapWord = (accumulator, word) => {
  // get the index of the word
  const index = getIndexOfWord(accumulator, word);

  if (index === -1) {
    // if word does not exist, set word / count
    accumulator.push({ word, count: 1 });
  } else {
    // if word exists, increment count
    accumulator[index].count = accumulator[index].count + 1;
  }

  // return
  return accumulator;
}

// reduce words, setting an empty arr as the default value
export const mapWords = (words) => words.reduce(mapWord, []);

// format words, running through a number of helpers
export const formatWords = (words) => {
  return helpers.splitStringBySpace(helpers.setToLowerCase(helpers.replaceWithSpace(helpers.replaceWithoutSpace(words))));
}

// default export
export default (req, res, next) => {
  write()
    .then(read)
    .then(words => {

      // run through mapping
      const data = mapPrimeValues(mapWords(formatWords(words)));

      // set res locals data
      res.locals.data = data;

      // return
      return next();
    })
    .catch(err => next(err));
}
