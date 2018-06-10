
import { expect } from 'chai';
import sinon from 'sinon';

import data, * as dataNamedExports from 'middleware/data';

describe('data middleware', () => {

  context('check if number is prime', () => {

    context('truthy, if', () => {

      const testCases = [2, 3, 5, 7, 11];

      testCases.forEach(testCase => {

        it(`is ${testCase}`, () => {

          const result = dataNamedExports.isPrime(testCase);

          expect(result).to.be.true;

        });

      });

    });

    context('falsy, if', () => {

      const testCases = [1, 4, 6, 8, 9, 10];

      testCases.forEach(testCase => {

        it(`is ${testCase}`, () => {

          const result = dataNamedExports.isPrime(testCase);

          expect(result).to.be.false;

        });

      });

    });

  });

  it('add is isPrime boolean', () => {

    const before = {
      word: 'here',
      count: 2
    };

    const after = Object.assign({}, before, {
      isPrime: true
    });

    const result = dataNamedExports.mapPrimeValue(before)

    expect(result).to.eql(after);

  });

  it('map over words, adding isPrime boolean', () => {

    const word1 = {
      word: 'here',
      count: 2
    };

    const word2 = {
      word: 'is',
      count: 4
    };

    const before = [
      word1,
      word2
    ];

    const after = [
      Object.assign({}, word1, {
        isPrime: true
      }),
      Object.assign({}, word2, {
        isPrime: false
      })
    ];

    const result = dataNamedExports.mapPrimeValues(before)

    expect(result).to.eql(after);

  });

  context('match word with word in obj', () => {

    const fakeWord = 'FAKE_WORD';

    it('truthy', () => {

      const result = dataNamedExports.matchWord({
        word: fakeWord
      }, fakeWord);

      expect(result).to.be.true;

    });

    it('falsy', () => {

      const result = dataNamedExports.matchWord({
        word: 'OTHER_FAKE_WORD'
      }, fakeWord);

      expect(result).to.be.false;

    });

  });

  context('get index of word in array by matching word against word in obj', () => {

    const fakeAccumulator = [{ word: 'here' }, { word: 'is' }];

    it('if exists', () => {

      const index = dataNamedExports.getIndexOfWord(fakeAccumulator, 'is');

      expect(index).to.equal(1);

    });

    it('if does not exist', () => {

      const index = dataNamedExports.getIndexOfWord(fakeAccumulator, 'a');

      expect(index).to.equal(-1);

    });

  });

  context('map word into accumulator', () => {

    it('word exists in accumulator', () => {

      const fakeWord = 'here';

      const before = [{ word: fakeWord, count: 1 }];

      const after = [
        Object.assign({}, before[0], {
          count: 2
        })
      ];

      const result = dataNamedExports.mapWord(before, fakeWord);

      expect(result).to.eql(after);

    });

    it('word does not exist in accumulator', () => {

      const fakeWord = 'is';

      const before = [{
        word: 'here',
        count: 1
      }];

      const after = [
        ...before,
        {
          word: fakeWord,
          count: 1
        }
      ];

      const result = dataNamedExports.mapWord(before, fakeWord);

      expect(result).to.eql(after)

    });

  });

  it('reduce words', () => {

    const before = ['here', 'is', 'is'];

    const after = [
      {
        word: before[0],
        count: 1
      },
      {
        word: before[1],
        count: 2
      }
    ]

    const result = dataNamedExports.mapWords(before);

    expect(result).to.eql(after);

  });

  it('format words in string, ready for mapping', () => {

    const fakeString = 'here!@#$%^&*(),.?"\'  :{}|<>\nIs';

    const result = dataNamedExports.formatWords(fakeString);

    expect(result).to.eql(['here', 'is']);

  });

  context('write then read', () => {

    let nextStub;

    before(() => nextStub = sinon.stub());

    afterEach(() => {
      data.__ResetDependency__('write');

      nextStub.reset();
    });

    it('resolved, call next middleware', done => {

      const fakeResponse = {
        locals: {}
      };

      const fakeWords = 'here is is';

      data.__Rewire__('write', () => Promise.resolve());
      data.__Rewire__('read', () => Promise.resolve(fakeWords));

      data({}, fakeResponse, nextStub);

      setImmediate(() => {

        expect(fakeResponse.locals.data).to.eql([
          {
            word: 'here',
            count: 1,
            isPrime: false
          },
          {
            word: 'is',
            count: 2,
            isPrime: true
          }
        ]);

        expect(nextStub.withArgs().calledOnce).to.be.true;

        data.__ResetDependency__('read');

        done();

      });

    });

    context('rejected, pass to error middleware', () => {

      const fakeError = 'FAKE_ERROR';

      it('at write', done => {

        data.__Rewire__('write', () => Promise.reject(fakeError));

        data({}, {}, nextStub);

        setImmediate(() => {

          expect(nextStub.withArgs(fakeError).calledOnce).to.be.true;

          done();

        });

      });

      it('at read', done => {

        data.__Rewire__('write', () => Promise.resolve());
        data.__Rewire__('read', () => Promise.reject(fakeError));

        data({}, {}, nextStub);

        setImmediate(() => {

          expect(nextStub.withArgs(fakeError).calledOnce).to.be.true;

          data.__ResetDependency__('read');

          done();

        });

      });

    });

  });

});
