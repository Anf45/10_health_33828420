const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

const appData = {
  appName: 'Workout Logger',
};


const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/users/login');
  }
  next();
};

// registration form
router.get('/register', (req, res) => {
  res.render('register.ejs', appData);
});

// handle registration form
router.post('/registered', (req, res, next) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !password) {
    return res.send('Username and password are required');
  }

  // password hash
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    const sql =
      'INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)';
    const params = [username, first_name, last_name, email, hashedPassword];

    db.query(sql, params, (dbErr, result) => {
      if (dbErr) {
        // e.g. duplicate username
        if (dbErr.code === 'ER_DUP_ENTRY') {
          return res.send('That username is already taken. Please go back and choose another.');
        }
        return next(dbErr);
      }

      res.send(
        `Hello ${first_name || ''} ${last_name || ''} – your account has been created. <a href="/users/login">Login here</a>.`
      );
    });
  });
});

// login form
router.get('/login', (req, res) => {
  res.render('login.ejs', appData);
});

// handle login
router.post('/loggedin', (req, res, next) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length === 0) {
      // no such user
      return res.send('Login failed: invalid username or password.');
    }

    const user = results[0];

    bcrypt.compare(password, user.hashed_password, (bcryptErr, match) => {
      if (bcryptErr) {
        return next(bcryptErr);
      }

      if (!match) {
        return res.send('Login failed: invalid username or password.');
      }

      // password correct
      req.session.userId = user.id;
      req.session.username = user.username;

      res.send(
        `Login successful. Welcome back, ${user.username}! <br><a href="/">Go to home</a> | <a href="/users/logout">Logout</a>`
      );
    });
  });
});

// destroy session
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out.');
    }
    res.send('You are now logged out. <a href="/">Return home</a>.');
  });
});

module.exports = router;
