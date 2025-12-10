const session = require('express-session');

const mysql = require('mysql2');

const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: 'someSuperSecretString', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000, // 10 mins
    },
  })
);

const db = mysql.createPool({
  host: process.env.HEALTH_HOST || 'localhost',
  user: process.env.HEALTH_USER || 'health_app',
  password: process.env.HEALTH_PASSWORD || 'qwertyuiop',
  database: process.env.HEALTH_DATABASE || 'health',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

global.db = db;

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');


app.use('/', mainRoutes);
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);



// start server
app.listen(port, () => {
  console.log(`Workout Logger app listening on http://localhost:${port}`);
});
