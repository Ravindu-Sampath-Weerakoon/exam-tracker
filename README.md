# Exam Tracker

Exam Tracker is a simple Node.js web application for tracking your exam subjects and topics. It uses Express.js, EJS for templating, and a MySQL database for data storage.

## Features
- Add, view, and manage exam subjects
- Add, view, and manage topics for each subject
- Simple and clean user interface

## Technologies Used
- Node.js
- Express.js
- EJS (Embedded JavaScript Templates)
- MySQL
- CSS (for styling)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MySQL](https://www.mysql.com/) installed and running

### Installation
1. Clone the repository:
   ```sh
   git clone [https://github.com/your-username/exam-tracker.git](https://github.com/Ravindu-Sampath-Weerakoon/exam-tracker.git
   cd exam-tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your database:
   - Create a MySQL database named `exam_tracker`.
   - Update the `.env` file with your database credentials:
     ```env
     DB_HOST=localhost
     DB_USER=your_mysql_user
     DB_PASS=your_mysql_password
     DB_NAME=exam_tracker
     ```
4. Run the application:
   ```sh
   node app.js
   ```
5. Open your browser and go to `http://localhost:3000`

## Project Structure
```
exam-tracker/
├── app.js           # Main application file
├── db.js            # Database connection
├── routes/          # Express route handlers
│   ├── subjects.js
│   └── topics.js
├── views/           # EJS templates
│   └── index.ejs
├── public/          # Static files (CSS, JS)
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── .env             # Environment variables
└── package.json     # Project metadata and dependencies
```

## License
This project is licensed under the MIT License.

---
Feel free to contribute or open issues to improve this project!
