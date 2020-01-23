const express = require('express');
const cors = require('cors');
const router = require('./expressRouter.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/posts', router);

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda Posts API</p>
  `);
});

module.exports = server;