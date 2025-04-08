const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');
const path = require('path');


const app = express();
const PORT = 3000;
app.use(express.json());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.post('/api/complete-test', (req, res) => {
  const { userId, testId } = req.body;
  if (!userId || !testId) return res.status(400).send('Missing data');

  db.saveUserTest(userId, testId);
  res.send({ success: true });
});

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

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function (err) {
    if (err) {
      return res.send('Username already exists.');
    }
    req.session.userId = this.lastID;
    // Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.send('Invalid login.');
      }
      req.session.userId = user.id;
      res.redirect('/index.html'); // ⬅ redirect to main page after login
    });
  });
  
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send('Invalid login.');
    }
    req.session.userId = user.id;
    res.redirect('/dashboard.html');
  });
});

// Auth check middleware
app.use('/dashboard.html', (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login.html');
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/index.html');
    });
  });


  const app1 = express();
  
  app1.use(express.json());
  
  app1.post('/api/complete-test', (req, res) => {
    const { userId, testId } = req.body;
    if (!userId || !testId) return res.status(400).send('Missing data');
  
    db.saveUserTest(userId, testId);
    res.send({ success: true });
  });


  
  // Save completed test
  app.post('/api/complete-test', (req, res) => {
    const { userId, testId } = req.body;
    if (!userId || !testId) return res.status(400).send('Missing data');
  
    db.saveUserTest(userId, testId);
    res.send({ success: true });
  });
  app.get('/api/user-tests/:userId', (req, res) => {
    const userId = req.params.userId;
    const tests = db.getUserTests(userId);
    res.json(tests);
  });
  

