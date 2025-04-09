const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');
console.log('Imported db object:', db); // <--- ADDED LOGGING STATEMENT
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.json());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true
}));

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash]);
    req.session.userId = result.lastID;
    res.redirect('/dashboard.html');
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.send('Username already exists.');
    }
    console.error('Signup error:', err);
    res.status(500).send('Signup failed');
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send('Invalid login.');
    }

    req.session.userId = user.id;
    res.redirect('/dashboard.html');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed');
  }
});

// Auth check middleware
app.use('/dashboard.html', (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/index.html');
  });
});

// Save completed test
app.post('/api/complete-test', async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId) return res.status(400).send('Missing data');

    await db.saveUserTest(userId, testId);
    res.send({ success: true });
  } catch (err) {
    console.error('Complete test error:', err);
    res.status(500).send('Failed to save test result');
  }
});

// Get user tests
app.get('/api/user-tests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const tests = await db.getUserTests(userId);
    res.json(tests);
  } catch (err) {
    console.error('Get user tests error:', err);
    res.status(500).send('Failed to get user tests');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});