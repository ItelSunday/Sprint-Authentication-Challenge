const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/dbConfig')

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
const credentials = req.body;

db('users')
.insert(credentials)
.select(id, username, password)
.then(ids => {
  res.status(200).json({credentials});
})
.catch(error => {
  res.status(400).json({ message: 'this username has been taken'});
  })
};

function login(req, res) {
  // implement user login
  const credentials = req.body;

  db('users')
  .first()
  .then(user => {
    if(user && bscrypt.compareSync(password, user.password)) {
      const token = generateToken(user);

      res.status(200).json({ message: `Are you ready to hear my dad jokes, ${user.username} `})
    } else {
      res.status(400).json({message: 'Invalid Credentials'})
    }
  })
  .catch(error => {
    res.status(500).json({message: 'Error:500'})
  })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
