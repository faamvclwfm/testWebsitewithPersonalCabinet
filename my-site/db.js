const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Create tables if they don't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS user_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  test_id TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP
)`);

// Database methods
const database = {
  // Raw SQLite methods
  get: (sql, params) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  }),

  run: (sql, params) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  }),

  // Custom methods
  saveUserTest: (userId, testId) => {
    const stmt = db.prepare(`INSERT INTO user_tests (user_id, test_id) VALUES (?, ?)`);
    stmt.run(userId, testId);
    stmt.finalize();
  },

  getUserTests: (userId) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`SELECT test_id, status, completed_at FROM user_tests WHERE user_id = ?`);
      stmt.all(userId, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = database;