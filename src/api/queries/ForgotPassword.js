
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql2');
const { execute } = require('../MySQL');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const EMAIL_SENDER = 'roberalvarado.20@gmail.com';
const EMAIL_PASSWORD = 'ehlkqifmwslkverv';


function fetchUserDataFromDatabase(email, callback) {
  const query = 'SELECT * FROM empleados WHERE correo = ?';
  execute(query, [email], (error, results) => {
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

app.post('/recuperarcontracorreo', (req, res) => {
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