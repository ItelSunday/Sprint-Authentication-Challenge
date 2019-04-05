const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(function(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  
    next();
  });

server.get("/", (req, res) => {
    res.send("Hi!");
});

configureRoutes(server);

module.exports = server;
