-- health database
CREATE DATABASE IF NOT EXISTS health;

USE health;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  hashed_password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  workout_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,       -- "Cardio", "Strength"
  duration_minutes INT NOT NULL,       -- "45"
  intensity VARCHAR(20),               -- "low", "medium", "high"
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_workouts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT,
  username VARCHAR(50),
  action VARCHAR(100),
  success TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);


-- application DB user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';
FLUSH PRIVILEGES;
