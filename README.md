
````markdown
# Workout Tracker API

Backend system for a fitness workout tracker application.  
Users can register, log in, create workout plans, schedule workouts, and track progress.  
JWT authentication is used to secure private routes.  

📌 Project Idea: [roadmap.sh - Fitness Workout Tracker](https://roadmap.sh/projects/fitness-workout-tracker)

---

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
````

3. Create a `.env` file (example below):

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=workout_tracker
   JWT_SECRET=your_jwt_secret
   ```
4. Create the database & tables (see schema below).
5. Seed the exercise data:

   ```bash
   npm run seed
   ```
6. Start the server:

   ```bash
   npm run dev   # with nodemon
   npm start     # normal
   ```

---

## API Endpoints

### Auth

* `POST /api/auth/register` — register a user `{ name, email, password }`
* `POST /api/auth/login` — login, returns `{ token }`

### Exercises

* `GET /api/exercises` — list all exercises (seeded data)

### Workouts

* `POST /api/workouts` — create workout plan (auth required)
* `GET /api/workouts` — list workouts for logged-in user
* `GET /api/workouts/:id` — fetch a specific workout
* `PUT /api/workouts/:id` — update workout
* `DELETE /api/workouts/:id` — delete workout

### Reports

* `GET /api/reports/progress` — show progress & past workout history (auth required)

---

## Database Schema (MySQL)

```sql
CREATE DATABASE IF NOT EXISTS workout_tracker;
USE workout_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  muscle_group VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  scheduled_at DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workout_exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_id INT NOT NULL,
  exercise_id INT NOT NULL,
  sets INT,
  reps INT,
  weight DECIMAL(5,2),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
```

---

## Seeder (Example)

Run:

```bash
npm run seed
```

It inserts default exercises:

* Push-up
* Squat
* Plank
* Running
* Bench Press

---

## Next Steps

* Add unit tests with Jest or Mocha.
* Expand reports with charts/statistics.
* Add pagination & filters for workouts.
* Improve validation with `express-validator`.
* Optionally integrate with wearables or external APIs.

---

🚀 Now your **Workout Tracker API** is ready to build and extend!

```
