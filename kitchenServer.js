const express = require('express');
const app = express();

const kitchenRouter = require('./routing.js');

app.use('/', kitchenRouter);

app.listen(8080, () => {
  console.log('run server at port 8080');
});