const mysql = require('mysql2/promise');
const readline = require('readline');
require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASS = '',
  DB_PORT = 3306,
  DB_NAME = 'exam_tracker'
} = process.env;

async function checkAndInit() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    port: parseInt(DB_PORT)
  });

  try {
    // Check if database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${DB_NAME}'`);
    if (databases.length === 0) {
      await connection.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database '${DB_NAME}' created.`);
    }

    await connection.query(`USE ${DB_NAME}`);

    // Check if tables exist
    const [tables] = await connection.query("SHOW TABLES LIKE 'subjects'");
    const [topicsTable] = await connection.query("SHOW TABLES LIKE 'topics'");
    const [descriptionsTable] = await connection.query("SHOW TABLES LIKE 'topic_descriptions'");
    const [hiddenTable] = await connection.query("SHOW TABLES LIKE 'hidden_subjects'");

    if (tables.length === 0 || topicsTable.length === 0 || descriptionsTable.length === 0 || hiddenTable.length === 0) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('Required tables are missing. Do you want to create them? (yes/no): ', (ans) => {
          rl.close();
          resolve(ans.toLowerCase());
        });
      });

      if (answer === 'yes' || answer === 'y') {
        console.log('Creating tables...');
        
        await connection.query(`
          CREATE TABLE IF NOT EXISTS subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            exam_date DATE NOT NULL
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS topics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            status ENUM('todo', 'done') DEFAULT 'todo',
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS topic_descriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            topic_id INT NOT NULL UNIQUE,
            description TEXT,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS hidden_subjects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL UNIQUE,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
          )
        `);
        
        console.log('Tables created successfully.');
      } else {
        console.log('Table creation skipped. The app may not work correctly.');
      }
    } else {
      console.log('Tables already exist.');
    }
  } catch (err) {
    console.error('Error during database initialization:', err.message);
  } finally {
    await connection.end();
  }
}

module.exports = checkAndInit;
