
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const EMAIL_SENDER = 'your-email@example.com';
const EMAIL_PASSWORD = 'your-email-password';

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'your-db-username',
  password: 'your-db-password',
  database: 'your-db-name',
});

function fetchUserDataFromDatabase(email, callback) {
  const query = 'SELECT * FROM users WHERE email = ?';
  dbPool.execute(query, [email], (error, results) => {
    if (error) {
      console.error(error);
      return callback(error, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    return callback(null, results[0]);
  });
}

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  fetchUserDataFromDatabase(email, (error, user) => {
    if (error) {
      return res.status(500).send('Database error');
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = new Date(Date.now() + 3600000);

    user.resetToken = token;
    user.resetTokenExpiration = expiration;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_SENDER,
      to: email,
      subject: 'Password Reset',
      // ...
    };

    // ... (same as in the previous examples)
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});