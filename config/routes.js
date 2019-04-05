const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtkey = process.env.JWT_SECRET;
const db = require('../database/dbConfig.js')

const { authenticate } = require('../auth/authenticate');


// Generate Token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, secret, options);
}


module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

// REGISTER ---------------
function register(req, res) {
  // implement user registration
  let {username, password} = req.body;

  if (username && password) {
  const hash = bcrypt.hashSync(password, 14);
  password = hash;

  db("users")
    .insert({username, password})
    .then(id => {
      res.status(200).json({
        message: `Are you ready to hear my dad jokes, ${username}`,
      });
    })
    .catch(error => {
      res.status(400).json({
        message: 'this username has been taken'
      });
    })
  } else {
    res.status(500).json(error);
  }
};

// LOGIN -----------------
function login(req, res) {
  // implement user login
  let {username, password} = req.body;

  if (username && password) {
    db("users")
      .where({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          
          res.status(200).json({
            message: `Hey ${user.username}, welcome!`,
            token
          });
        } else {
          res.status(401).json({
            message: "Invalid Credentials"
          });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({
      message: "username and password required"
    });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: {
      accept: 'application/json'
    },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error Fetching Jokes',
        error: err
      });
    });
}