
import fs from 'fs';

import { expect } from 'chai';
import sinon from 'sinon';

import read, { filePath } from 'utils/read';

describe('read util', () => {

  let createReadStreamOnStub;

  before(() => createReadStreamOnStub = sinon.stub());

  afterEach(() => createReadStreamOnStub.reset());

  it('resolve with data', done => {

    const fakeData = 'FAKE_DATA';

    createReadStreamOnStub.withArgs('data').yields(fakeData);
    createReadStreamOnStub.withArgs('end').yields();

    const createReadStream = sinon.stub(fs, 'createReadStream').returns({
      on: createReadStreamOnStub
    });

    read()
      .then(data => {

        expect(createReadStream.withArgs(filePath).calledOnce).to.be.true;

        expect(data).to.equal(fakeData);

        fs.createReadStream.restore();

        done();

      });

  });

  it('reject with error', done => {

    const fakeError = 'FAKE_ERROR';

    createReadStreamOnStub.withArgs('error').yields(fakeError);

    const createReadStream = sinon.stub(fs, 'createReadStream').returns({
      on: createReadStreamOnStub
    });

    read()
      .catch(err => {

        expect(createReadStream.withArgs(filePath).calledOnce).to.be.true;

        expect(err).to.equal(fakeError);

        fs.createReadStream.restore();

        done();

      });

  });

});
