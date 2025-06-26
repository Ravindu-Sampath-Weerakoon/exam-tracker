const express = require('express');
const router = express.Router();
const db = require('../db');

// Route: Add a new subject
// POST /subjects/add
router.post('/add', (req, res) => {
  const { name, exam_date } = req.body;

  if (!name || !exam_date) {
    return res.status(400).send('Name and exam date are required.');
  }

  const query = 'INSERT INTO subjects (name, exam_date) VALUES (?, ?)';
  db.query(query, [name, exam_date], (err) => {
    if (err) {
      console.error('Database error when adding subject:', err);
      return res.status(500).send('Server error');
    }

    res.redirect('/');
  });
});

module.exports = router;
