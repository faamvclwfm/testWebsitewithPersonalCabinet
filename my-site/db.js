const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

module.exports = db;
// Create user_tests table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Save test completion
function saveUserTest(userId, testId) {
  const stmt = db.prepare(`INSERT INTO user_tests (user_id, test_id) VALUES (?, ?)`);
  stmt.run(userId, testId);
}

// Get all tests completed by a user
function getUserTests(userId) {
  const stmt = db.prepare(`SELECT test_id, status, completed_at FROM user_tests WHERE user_id = ?`);
  return stmt.all(userId);
}

// Export these along with your existing exports
module.exports = {
  ...module.exports,
  saveUserTest,
  getUserTests
};
// Create user_tests table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Save test completion
function saveUserTest(userId, testId) {
  const stmt = db.prepare(`INSERT INTO user_tests (user_id, test_id) VALUES (?, ?)`);
  stmt.run(userId, testId);
}

// Get all tests completed by a user
function getUserTests(userId) {
  const stmt = db.prepare(`SELECT test_id, status, completed_at FROM user_tests WHERE user_id = ?`);
  return stmt.all(userId);
}

// Export these functions
module.exports = {
  ...module.exports,
  saveUserTest,
  getUserTests
};
