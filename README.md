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
    
