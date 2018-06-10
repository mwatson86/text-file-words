
import { expect } from 'chai';

import * as helpers from 'helpers';

describe('helpers', () => {

  context('replace without space, if', () => {

    const expected = 'here is';

    const testCases = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', '"', '\'', ':', '{', '}', '|', '<', '>'];

    testCases.forEach(testCase => {

      it(`${testCase} symbol`, () => {

        const result = helpers.replaceWithoutSpace(`${testCase}here is`);

        expect(result).to.equal(expected);

      });

    });

  });

  context('replace with space, if', () => {

    const expected = 'here is';

    const testCases = [
      {
        name: 'more than 1 space',
        test: 'here  is'
      },
      {
        name: 'new line',
        test: 'here\nis'
      },
      {
        name: 'hyphen',
        test: 'here-is'
      }
    ];

    testCases.forEach(({ name, test }) => {

      it(name, () => {

        const result = helpers.replaceWithSpace(test);

        expect(result).to.equal(expected);

      });

    });

  });

  it('set string to lowercase', () => {

    const fakeString = 'Here is Some Text';

    const result = helpers.setToLowerCase(fakeString);

    expect(result).to.equal(fakeString.toLowerCase());

  });

  it('split string by space', () => {

    const fakeString = 'here is some text';

    const result = helpers.splitStringBySpace(fakeString);

    expect(result).to.eql(fakeString.split(' '));

  });

});
