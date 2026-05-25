import { Database } from 'sqlite';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'learner' | 'teacher';
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function createUserTable(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('learner', 'teacher')),
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}

export async function findUserByEmail(db: Database, email: string): Promise<User | undefined> {
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function findUserById(db: Database, id: number): Promise<User | undefined> {
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function createUser(db: Database, email: string, password: string, role: string, name: string): Promise<User> {
  const result = await db.run(
    'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
    [email, password, role, name]
  );
  
  const user = await findUserById(db, result.lastID as number);
  if (!user) throw new Error('Failed to create user');
  return user;
}
