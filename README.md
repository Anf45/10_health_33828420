# Workout Logger - Dynamic Web

A website that allows users to log workouts, view training history, search workouts, and securely manage their account.
Built with Node.js, Express, EJS, MySQL, deployed on the Goldsmiths VM using forever.

## Features
  
    User registration and secure login (bcrypt + sessions)
    
    Add workouts (date, category, duration, intensity, notes)
    
    View and search workouts (keyword + date range)
    
    Validation and sanitisation on all forms
    
    Audit logging for login success/failure and logout
    
    Admin only audit page
    
    Private data: users only see their own workouts
    
    Installation via create_db.sql and insert_test_data.sql
    
## Structure
    
    10_health_33828420/
    │ index.js
    │ package.json
    │ links.txt
    │ sql/
    │   create_db.sql
    │   insert_test_data.sql
    │ routes/
    │   main.js
    │   users.js
    │   workouts.js
    │ views/
    │   *.ejs
    │ public/
    │   css/

## Database

  users -> stores user accounts
  workouts -> 1 to many relationship with users
  audit_log -> stores login/logout events (only admin)

## Local Setup

    git clone https://github.com/Anf45/10_health_33828420
    cd 10_health_33828420
    npm install

    # Create DB

    SOURCE sql/create_db.sql;
    SOURCE sql/insert_test_data.sql;

    # Run

    node index.js

    # Visit:

    http://localhost:8000

## VM Deployment 

    git clone https://github.com/Anf45/10_health_33828420
    cd 10_health_33828420
    npm install

    # MySQL

    SOURCE ~/10_health_33828420/sql/create_db.sql;
    SOURCE ~/10_health_33828420/sql/insert_test_data.sql;

    # Run

    forever start -a --uid "healthApp" index.js

    # Visit: 

    http://www.doc.gold.ac.uk/usr/205/


    



    


