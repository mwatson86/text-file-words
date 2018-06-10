
import { expect } from 'chai';
import sinon from 'sinon';

import renderMiddleware from 'middleware/render';

describe('render middleware', () => {

  it('calls render with correct args', () => {

    const renderStub = sinon.stub();

    const fakeData = 'FAKE_DATA';

    const fakeResponse = {
      render: renderStub,
      locals: {
        data: fakeData
      }
    };

    renderMiddleware({}, fakeResponse)

    expect(renderStub.withArgs('index', {
      title: 'CTM Solution',
      data: fakeData
    }).calledOnce).to.be.true;

  });

});
