const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 2005;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err;
  }
  console.log('Database connected');
});

// Validate email function
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

app.post('/api/feedback', (req, res) => {
  const { feedback, category, otherCategory, email } = req.body;

  if (!feedback || !category || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Please fill in all required fields correctly' });
  }

  let sql = "INSERT INTO feedback (feedback, category, otherCategory, email) VALUES (?, ?, ?, ?)";
  db.query(sql, [feedback, category, otherCategory, email], (err, results) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ message: 'Failed to submit feedback' });
    }

    return res.json({ message: 'Feedback submitted successfully!' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
