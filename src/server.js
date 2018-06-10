
import express from 'express';

import dataMiddleware from 'middleware/data';
import renderMiddleware from 'middleware/render';

// set port
const PORT = 3000;

// start
const startup = () => {

  // define app
  const app = express();

  // set view engine
  app.set('view engine', 'pug');

  // set root route
  app.get('/', dataMiddleware, renderMiddleware);

  // listen on port 3000, on set paths
  const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  // returns http.server
  return server;

};

// default export
export default startup;
