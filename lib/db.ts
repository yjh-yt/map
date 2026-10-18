import Database from "better-sqlite3";
const db = new Database("./dev.db");

db.exec(`
CREATE TABLE IF NOT EXISTS chat_message (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userText TEXT NOT NULL,
  aiText TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
