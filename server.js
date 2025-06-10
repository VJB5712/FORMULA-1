const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: process.env.vjathinbharyav1st + '@gmail.com',
  pass: process.env.kiorhnystyuollsp
}
});

app.post('/send-code', (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = code;

  const mailOptions = {
    from: 'vjathinbhargav1st@gmail.com',
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.send('Failed to send OTP.');
    res.send('OTP sent to your email.');
  });
});

app.post('/register', (req, res) => {
  const { name, username, password, email, code } = req.body;
  if (otpStore[email] != code) return res.send('Incorrect OTP');

  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
    if (users.find(u => u.username === username)) {
      return res.send('Username already exists');
    }
  }

  users.push({ name, username, password, email });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.send('Registration successful');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json'));
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send('Login failed');
  res.send('Login successful');
});

app.listen(3000, () => console.log('Server running on port 3000'));
