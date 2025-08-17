const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new topic
router.post('/add', (req, res) => {
  const { subject_id, title } = req.body;
  const query = 'INSERT INTO topics (subject_id, title, status) VALUES (?, ?, ?)';
  db.query(query, [subject_id, title, 'todo'], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Toggle topic status (done/todo)
router.post('/toggle', (req, res) => {
  const { topic_id, status } = req.body;
  const query = 'UPDATE topics SET status = ? WHERE id = ?';
  db.query(query, [status, topic_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating topic');
    }
    res.status(200).send('OK'); // No redirect
  });
});


// Route: Update a topic
// POST /topics/update
router.post('/update', (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).send('ID and title are required.');
  }

  const query = 'UPDATE topics SET title = ? WHERE id = ?';
  db.query(query, [title, id], (err) => {
    if (err) {
      console.error('Database error when updating topic:', err);
      return res.status(500).send('Server error');
    }

    res.redirect('/');
  });
});

// Route: Delete a topic
// POST /topics/delete
router.post('/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('ID is required.');
  }

  const query = 'DELETE FROM topics WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Database error when deleting topic:', err);
      return res.status(500).send('Server error');
    }

    res.redirect('/');
  });
});

module.exports = router;
