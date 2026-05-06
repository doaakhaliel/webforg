const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all courses
router.get('/', (req, res) => {
  const db = req.app.get('db');
  db.all('SELECT * FROM courses ORDER BY created_at DESC', (err, courses) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(courses);
  });
});

// Get single course with lessons
router.get('/:id', (req, res) => {
  const db = req.app.get('db');
  const courseId = req.params.id;

  db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    db.all('SELECT * FROM lessons WHERE course_id = ? ORDER BY "order"', [courseId], (err, lessons) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...course, lessons });
    });
  });
});

// Create course (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
  const db = req.app.get('db');
  const { title, description, image, level, duration, instructor, price } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  db.run(
    'INSERT INTO courses (title, description, image, level, duration, instructor, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, image, level, duration, instructor, price || 0],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Course created successfully' });
    }
  );
});

// Enroll in course
router.post('/:id/enroll', authenticateToken, (req, res) => {
  const db = req.app.get('db');
  const courseId = req.params.id;
  const userId = req.user.userId;

  db.get(
    'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
    [userId, courseId],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existing) return res.status(400).json({ error: 'Already enrolled' });

      db.run(
        'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
        [userId, courseId],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Enrolled successfully' });
        }
      );
    }
  );
});

// Update progress
router.put('/:courseId/progress', authenticateToken, (req, res) => {
  const db = req.app.get('db');
  const { courseId } = req.params;
  const { progress } = req.body;
  const userId = req.user.userId;

  db.run(
    'UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?',
    [progress, userId, courseId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Progress updated' });
    }
  );
});

// Get user's enrolled courses
router.get('/user/enrolled', authenticateToken, (req, res) => {
  const db = req.app.get('db');
  const userId = req.user.userId;

  db.all(
    `SELECT c.*, e.progress, e.enrolled_at 
     FROM courses c 
     JOIN enrollments e ON c.id = e.course_id 
     WHERE e.user_id = ?`,
    [userId],
    (err, courses) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(courses);
    }
  );
});

module.exports = router;