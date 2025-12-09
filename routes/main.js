const express = require('express');
const router = express.Router();

const appData = {
  appName: 'Workout Logger',
};

// home page
router.get('/', (req, res) => {
  res.render('index.ejs', appData);
});

// about page
router.get('/about', (req, res) => {
  res.render('about.ejs', appData);
});

// DB test route
router.get('/db-test', (req, res, next) => {
  db.query('SELECT COUNT(*) AS userCount FROM users', (err, results) => {
    if (err) {
      // Let Express handle the error for now
      return next(err);
    }
    const count = results[0].userCount;
    res.send(`Database connection OK. There are currently ${count} user(s) in the users table.`);
  });
});

module.exports = router;
