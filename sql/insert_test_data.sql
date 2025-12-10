USE health;

INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES
('demo', 'Demo', 'User', 'demo@example.com', 'changeme');

INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES
('gold', 'Gold', 'Marker', 'gold@example.com', '$2b$10$CwsKsCgEhvbpqWQFZP3efueyEsnvw/HVkPaua9jGB83Eg8bYJXHH.');

INSERT INTO workouts (user_id, workout_date, category, duration_minutes, intensity, notes)
VALUES
(1, '2025-12-01', 'Cardio', 30, 'medium', 'Easy run'),
(1, '2025-12-02', 'Strength', 45, 'high', 'Upper body workout'),
(1, '2025-12-03', 'Mobility', 20, 'low', 'Stretching and foam rolling');
