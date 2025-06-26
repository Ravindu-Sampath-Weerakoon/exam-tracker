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

module.exports = router;