import type { Database } from '../db.js';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'learner' | 'teacher';
  created_at: string;
  updated_at: string;
}

export async function createUserTable(db: Database): Promise<void> {
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('learner', 'teacher')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
}

export async function findUserByEmail(db: Database, email: string): Promise<User | undefined> {
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function findUserById(db: Database, id: number): Promise<User | undefined> {
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function createUser(db: Database, email: string, passwordHash: string, role: 'learner' | 'teacher'): Promise<User> {
  const result = await db.run(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    [email, passwordHash, role]
  );
  
  const user = await findUserById(db, result.id as number);
  if (!user) throw new Error('Failed to create user');
  return user;
}
