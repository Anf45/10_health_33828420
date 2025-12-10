const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

const { check, validationResult } = require('express-validator');

function logAudit(username, action, success = 1) {
  const sql = "INSERT INTO audit_log (username, action, success) VALUES (?, ?, ?)";
  db.query(sql, [username, action, success], (err) => {
    if (err) {
      console.error("Audit log error:", err);
    }
  });
}


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
router.post(
  '/registered',
  [
    // validation
    check('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters.'),
    check('email')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Please enter a valid email address.'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.'),
  ],
  (req, res, next) => {
    // validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msgs = errors
        .array()
        .map((e) => `<li>${e.msg}</li>`)
        .join('');
      return res.send(
        `<h1>Registration error</h1><ul>${msgs}</ul><p><a href="/users/register">Go back</a></p>`
      );
    }

    // sanitise inputs
    const username = req.sanitize(req.body.username);
    const first_name = req.sanitize(req.body.first_name || '');
    const last_name = req.sanitize(req.body.last_name || '');
    const email = req.sanitize(req.body.email || '');
    const password = req.body.password; 

    // hash password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const sql =
        'INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)';
      const params = [username, first_name, last_name, email, hashedPassword];

      db.query(sql, params, (dbErr, result) => {
        if (dbErr) {
          if (dbErr.code === 'ER_DUP_ENTRY') {
            return res.send(
              'That username is already taken. Please go back and choose another.'
            );
          }
          return next(dbErr);
        }

        res.send(
          `Hello ${first_name} ${last_name} – your account has been created. <a href="/users/login">Login here</a>.`
        );
      });
    });
  }
);


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
      logAudit(username, "login_failed", 0);

      // no such user
      return res.send('Login failed: invalid username or password.');
    }

    const user = results[0];

    bcrypt.compare(password, user.hashed_password, (bcryptErr, match) => {
      if (bcryptErr) {
        return next(bcryptErr);
      }

        if (!match) {
        logAudit(username, "login_failed", 0);
        return res.send("Login failed: invalid username or password.");
        }

        // Login success:
        logAudit(username, "login_success", 1);

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
  const username = req.session.username || "unknown";

  logAudit(username, "logout", 1);

  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out.");
    }
    res.send('You are now logged out. <a href="/">Return home</a>.');
  });
});

// logged in users to see audit
router.get('/audit', redirectLogin, (req, res, next) => {
    // admin
  if (req.session.username !== "gold") {
    return res.send("Access denied: only admin can view audit log.");
  }

  const sql = "SELECT username, action, success, created_at FROM audit_log ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return next(err);

    res.render("audit.ejs", {
      appName: appData.appName,
      logs: results,
      user: req.session.username
    });
  });
});


module.exports = router;
