// run: npm run seed
const pool = require('../config/db');

const exercises = [
  { name: 'Push-up', description: 'Bodyweight push-ups', category: 'strength', muscle_group: 'chest' },
  { name: 'Squat', description: 'Barbell back squat', category: 'strength', muscle_group: 'legs' },
  { name: 'Plank', description: 'Core hold', category: 'stability', muscle_group: 'core' },
  { name: 'Running', description: 'Cardio run', category: 'cardio', muscle_group: 'legs' },
  { name: 'Bench Press', description: 'Barbell bench press', category: 'strength', muscle_group: 'chest' }
];

(async () => {
  try {
    for (const e of exercises) {
      await pool.execute(
        'INSERT INTO exercises (name, description, category, muscle_group) VALUES (?, ?, ?, ?)',
        [e.name, e.description, e.category, e.muscle_group]
      );
    }
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
