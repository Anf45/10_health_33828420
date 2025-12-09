const mysql = require('mysql2');

const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
//
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


app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

// start server
app.listen(port, () => {
  console.log(`Workout Logger app listening on http://localhost:${port}`);
});
