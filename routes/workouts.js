const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const appData = {
  appName: 'Workout Logger',
};

// allow access if logged in
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/users/login');
  }
  next();
};

// form to add a workout
router.get('/add', redirectLogin, (req, res) => {
  res.render('add-workout.ejs', appData);
});

// save workout to DB
router.post(
  '/added',
  redirectLogin,
  [
    check('workout_date')
      .notEmpty()
      .withMessage('Workout date is required.'),
    check('category')
      .notEmpty()
      .withMessage('Category is required.'),
    check('duration_minutes')
      .isInt({ min: 1, max: 1440 })
      .withMessage('Duration must be a number between 1 and 1440 minutes.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msgs = errors
        .array()
        .map((e) => `<li>${e.msg}</li>`)
        .join('');
      return res.send(
        `<h1>Workout error</h1><ul>${msgs}</ul><p><a href="/workouts/add">Go back</a></p>`
      );
    }

    const userId = req.session.userId;

    // sanitize
    const workout_date = req.sanitize(req.body.workout_date);
    const category = req.sanitize(req.body.category);
    const durationInt = parseInt(req.body.duration_minutes, 10) || 0;
    const intensity = req.sanitize(req.body.intensity || '');
    const notes = req.sanitize(req.body.notes || '');

    const sql =
      'INSERT INTO workouts (user_id, workout_date, category, duration_minutes, intensity, notes) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [userId, workout_date, category, durationInt, intensity, notes];

    db.query(sql, params, (err, result) => {
      if (err) {
        return next(err);
      }

      res.send(
        `Workout added successfully! <br><a href="/workouts/list">View your workouts</a> | <a href="/workouts/add">Add another</a>`
      );
    });
  }
);


// workouts for current user
router.get('/list', redirectLogin, (req, res, next) => {
  const userId = req.session.userId;

  const sql =
    'SELECT workout_date, category, duration_minutes, intensity, notes, created_at FROM workouts WHERE user_id = ? ORDER BY workout_date DESC, created_at DESC';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return next(err);
    }

    res.render('workouts-list.ejs', {
      appName: appData.appName,
      workouts: results,
    });
  });
});


// search form
router.get('/search', redirectLogin, (req, res) => {
  res.render('workouts-search.ejs', {
    appName: appData.appName,
  });
});

// handle search query
router.get('/search_results', redirectLogin, (req, res, next) => {
  const userId = req.session.userId;
  const { keyword, from_date, to_date } = req.query;

  // SQL + params
  let sql =
    'SELECT workout_date, category, duration_minutes, intensity, notes, created_at FROM workouts WHERE user_id = ?';
  const params = [userId];

  // filter by keyword (
  if (keyword && keyword.trim() !== '') {
    sql += ' AND (category LIKE ? OR notes LIKE ?)';
    const like = '%' + keyword.trim() + '%';
    params.push(like, like);
  }

  if (from_date) {
    sql += ' AND workout_date >= ?';
    params.push(from_date);
  }

  if (to_date) {
    sql += ' AND workout_date <= ?';
    params.push(to_date);
  }

  // newest first
  sql += ' ORDER BY workout_date DESC, created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      return next(err);
    }

    res.render('workouts-search-results.ejs', {
      appName: appData.appName,
      workouts: results,
      keyword: keyword || '',
      from_date: from_date || '',
      to_date: to_date || '',
    });
  });
});


module.exports = router;
