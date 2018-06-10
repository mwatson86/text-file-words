
import { expect } from 'chai';
import request from 'supertest';

import startup from 'server';

describe('startup', () => {

  it('root', done => {

    const markup = 'FAKE_MARKUP';

    startup.__Rewire__('dataMiddleware', (req, res, next) => next());
    startup.__Rewire__('renderMiddleware', (req, res) => res.send(markup));

    const server = startup();

    request(server)
      .get('/')
      .expect(200, markup)
      .end(err => {

        if (err) {
          throw err;
        }

        startup.__ResetDependency__('dataMiddleware');
        startup.__ResetDependency__('renderMiddleware');

        server.close(done);

      })

  });

});
