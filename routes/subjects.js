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


// Route: Update a subject
// POST /subjects/update
router.post('/update', (req, res) => {
  const { id, name, exam_date } = req.body;

  if (!id || !name || !exam_date) {
    return res.status(400).send('ID, name, and exam date are required.');
  }

  const query = 'UPDATE subjects SET name = ?, exam_date = ? WHERE id = ?';
  db.query(query, [name, exam_date, id], (err) => {
    if (err) {
      console.error('Database error when updating subject:', err);
      return res.status(500).send('Server error');
    }

    res.redirect('/');
  });
});

// Route: Delete a subject
// POST /subjects/delete
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('ID is required.');
  }

  const deleteTopicsQuery = 'DELETE FROM topics WHERE subject_id = ?';
  db.query(deleteTopicsQuery, [id], (err) => {
    if (err) {
      console.error('Database error when deleting topics:', err);
      return res.status(500).send('Server error');
    }

    const deleteSubjectQuery = 'DELETE FROM subjects WHERE id = ?';
    db.query(deleteSubjectQuery, [id], (err) => {
      if (err) {
        console.error('Database error when deleting subject:', err);
        return res.status(500).send('Server error');
      }

      res.redirect('/');
    });
  });
});

module.exports = router;

