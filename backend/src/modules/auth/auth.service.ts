import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Database } from '../../database/db.js';
import { DecodedToken } from './auth.types.js';

function getJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  return 'readlr-development-secret';
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRY = '7d';

export class AuthService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    role: 'learner' | 'teacher',
    name: string
  ): Promise<{ id: number; email: string; role: string; name: string }> {
    // Check if user exists
    const existingUser = await this.db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await this.db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role]
    );

    const userId = result.id;

    // If learner, create learner profile with name
    if (role === 'learner') {
      await this.db.run(
        'INSERT INTO learner_profiles (user_id, name) VALUES (?, ?)',
        [userId, name]
      );
    }

    const user = await this.db.get('SELECT id, email, role FROM users WHERE id = ?', [userId]);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: role === 'learner' ? name : email.split('@')[0], // For teachers, use email prefix as fallback
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ id: number; email: string; role: string; name: string; avatar: string; avatarUrl: string | null }> {
    const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

        // In login()
    let name = user.email.split('@')[0];
    let avatar = '🦊';
    let avatarUrl: string | null = null;

    if (user.role === 'learner') {
    const learnerProfile = await this.db.get(
      'SELECT name, avatar, avatar_url FROM learner_profiles WHERE user_id = ?',
      [user.id]
    );
    if (learnerProfile) {
      name = learnerProfile.name;
      avatar = learnerProfile.avatar ?? '🦊';
      avatarUrl = learnerProfile.avatar_url ?? null;
    }
    }

    return {
    id: user.id,
    email: user.email,
    role: user.role,
    name,
    avatar,
    avatarUrl,
    };  
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
      {
        id: userId,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number) {
    const user = await this.db.get('SELECT id, email, role FROM users WHERE id = ?', [userId]);

    if (!user) {
      return null;
    }

    // Get name based on role
    // In getUserById()
    let name = user.email.split('@')[0];
    let avatar = '🦊';
    let avatarUrl: string | null = null;

    if (user.role === 'learner') {
      const learnerProfile = await this.db.get(
        'SELECT name, avatar, avatar_url FROM learner_profiles WHERE user_id = ?',
        [userId]
      );
      if (learnerProfile) {
        name = learnerProfile.name;
        avatar = learnerProfile.avatar ?? '🦊';
        avatarUrl = learnerProfile.avatar_url ?? null;
      }
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name,
      avatar,
      avatarUrl,
    };
  }
}
