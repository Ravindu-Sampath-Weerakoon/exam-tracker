const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const checkAndInit = require('./scripts/init-db');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Removed redundant app.use(express.static('public'));

const subjectsRouter = require('./routes/subjects');
const topicsRouter = require('./routes/topics');
const db = require('./db');

app.get('/', (req, res) => {
  const subjectQuery = 'SELECT * FROM subjects ORDER BY exam_date ASC';
  db.query(subjectQuery, (err, subjects) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    const topicQuery = 'SELECT * FROM topics';
    db.query(topicQuery, (err, topics) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Internal Server Error');
      }

      const progress = {};
      let totalDone = 0;
      let totalTopics = 0;

      const today = new Date();

      subjects.forEach(subject => {
        const subjectTopics = topics.filter(t => t.subject_id === subject.id);
        const done = subjectTopics.filter(t => t.status === 'done').length;
        const total = subjectTopics.length;

        progress[subject.id] = total > 0 ? Math.round((done / total) * 100) : 0;

        totalDone += done;
        totalTopics += total;

        const examDate = new Date(subject.exam_date);
        const diffTime = examDate - today;
        subject.daysRemaining = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
      });

      const overallProgress = totalTopics > 0 ? Math.round((totalDone / totalTopics) * 100) : 0;

      res.render('index', { subjects, topics, progress, overallProgress });
    });
  });
});

app.use('/subjects', subjectsRouter);
app.use('/topics', topicsRouter);

// Initialize database and then start server
checkAndInit().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});