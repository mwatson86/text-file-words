
import fs from 'fs';

import { expect } from 'chai';
import sinon from 'sinon';

import write, * as writeNamedExports from 'utils/write';

describe('write util', () => {

  it('external text file reference', () => {

    expect(writeNamedExports.externalTextFile).to.equal('http://www.loyalbooks.com/download/text/Railway-Children-by-E-Nesbit.txt');

  });

  context('does the file exist locally', () => {

    let accessSyncStub = null;

    beforeEach(() => accessSyncStub = sinon.stub(fs, 'accessSync'));
    afterEach(() => accessSyncStub.restore());

    it('truthy', () => {

      accessSyncStub.returns(undefined);

      const result = writeNamedExports.fileExists();

      expect(accessSyncStub.withArgs(writeNamedExports.filePath).calledOnce).to.be.true;

      expect(result).to.be.true;

    });

    it('falsy', () => {

      accessSyncStub.throws();

      const result = writeNamedExports.fileExists();

      expect(accessSyncStub.withArgs(writeNamedExports.filePath).calledOnce).to.be.true;

      expect(result).to.be.false;

    });

  });

  context('write or resolve', () => {

    let fetchStub = null;

    before(() => fetchStub = sinon.stub());

    afterEach(() => fetchStub.reset());

    it('if file exists, resolve', done => {

      write.__Rewire__('fetch', fetchStub);
      write.__Rewire__('fileExists', () => true);

      write()
        .then(() => {

          expect(fetchStub.notCalled).to.be.true;

          write.__ResetDependency__('fetch');
          write.__ResetDependency__('fileExists');

          done();

        });

    });

    context('if file does not exist, fetch', () => {

      before(() => write.__Rewire__('fileExists', () => false));

      after(() => write.__ResetDependency__('fileExists'));

      it('resolve', done => {

        const fakeWstream = 'FAKE_WSTREAM';

        const createWriteStreamStub = sinon.stub(fs, 'createWriteStream').returns(fakeWstream);
        const pipeStub = sinon.stub();
        const onStub = sinon.stub();

        onStub.withArgs('end').yields();

        const fakeResponse = {
          body: {
            pipe: pipeStub,
            on: onStub
          }
        };

        fetchStub.returns(Promise.resolve(fakeResponse));

        write.__Rewire__('fetch', fetchStub);

        write()
          .then(() => {

            expect(fetchStub.withArgs(writeNamedExports.externalTextFile).calledOnce).to.be.true;

            expect(createWriteStreamStub.withArgs(writeNamedExports.filePath).calledOnce).to.be.true;

            expect(pipeStub.withArgs(fakeWstream).calledOnce).to.be.true;

            write.__ResetDependency__('fetch');

            createWriteStreamStub.restore();

            done();

          });

      });

      context('reject', () => {

        const fakeError = 'FAKE_ERROR';

        it('at fetch', done => {

          fetchStub.returns(Promise.reject(fakeError));

          write.__Rewire__('fetch', fetchStub);

          write()
            .catch(err => {

              expect(fetchStub.withArgs(writeNamedExports.externalTextFile).calledOnce).to.be.true;

              expect(err).to.equal(fakeError);

              write.__ResetDependency__('fetch');

              done();

            });

        });

        it('at write', done => {

          const fakeWstream = 'FAKE_WSTREAM',
            fakeError = 'FAKE_ERROR';

          const createWriteStreamStub = sinon.stub(fs, 'createWriteStream').returns(fakeWstream);
          const pipeStub = sinon.stub();
          const onStub = sinon.stub();

          onStub.withArgs('error').yields(fakeError);

          const fakeResponse = {
            body: {
              pipe: pipeStub,
              on: onStub
            }
          };

          fetchStub.returns(Promise.resolve(fakeResponse));

          write.__Rewire__('fetch', fetchStub);

          write()
            .catch(err => {

              expect(fetchStub.withArgs(writeNamedExports.externalTextFile).calledOnce).to.be.true;

              expect(createWriteStreamStub.withArgs(writeNamedExports.filePath).calledOnce).to.be.true;

              expect(pipeStub.withArgs(fakeWstream).calledOnce).to.be.true;

              expect(err).to.equal(fakeError);

              write.__ResetDependency__('fetch');

              createWriteStreamStub.restore();

              done();

            });

        });

      });

    });

  });

});
