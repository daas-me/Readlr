import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginRequest, RegisterRequest, AuthResponse } from './auth.types.js';
import { registrationRole } from './adminInvitation.js';
import { createLimiter } from '../../middleware/rateLimit.js';
import { isStrongPassword, PASSWORD_RULES_MESSAGE } from './passwordPolicy.js';

export const CONSENT_VERSION = 'guardian-consent-v1';
// Five wrong passwords lock account deletion for 15 minutes.
export const deletePasswordLimit = createLimiter(5, 15 * 60_000, 'Too many wrong passwords. Please wait 15 minutes.');

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, confirmPassword, role, guardianConfirmed, consent, consentVersion }: RegisterRequest = req.body;

      // Validation
      if (!email || !password || !confirmPassword || !role) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ success: false, message: 'Passwords do not match' });
        return;
      }

      if (!isStrongPassword(password)) {
        res.status(400).json({ success: false, message: PASSWORD_RULES_MESSAGE });
        return;
      }

      // Staff roles are assigned only after server-side invitation checks.
      if (role !== 'learner') {
        res.status(403).json({ success: false, message: 'Staff accounts are invitation-only' });
        return;
      }

      // Register user
      const normalizedEmail = email.trim().toLowerCase();
      const assignedRole = registrationRole(normalizedEmail, req.body.adminInvitation);
      const consented = guardianConfirmed === true && consent === true && consentVersion === CONSENT_VERSION;
      if (assignedRole === 'learner' && !consented) {
        res.status(400).json({ success: false, message: 'Please confirm you are the guardian and agree to the privacy notice.' });
        return;
      }
      const user = await this.authService.register(normalizedEmail, password, assignedRole, assignedRole === 'learner' ? CONSENT_VERSION : null);

      // Generate token
      const token = this.authService.generateToken(user.id, user.email, user.role);

      const response: AuthResponse = {
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role as 'learner' | 'teacher' | 'admin',
          name: user.name,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ success: false, message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      // Login user
      const user = await this.authService.login(email.trim().toLowerCase(), password);

      // Generate token
      const token = this.authService.generateToken(user.id, user.email, user.role, user.authVersion);

      const response: AuthResponse = {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role as 'learner' | 'teacher',
          name: user.name,
        },
      };

      res.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ success: false, message });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await this.authService.getUserById(userId);

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get profile';
      res.status(500).json({ success: false, message });
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { confirmation, password } = req.body ?? {};
      if (confirmation !== 'DELETE' || typeof password !== 'string' || !password) {
        res.status(400).json({ success: false, message: 'Type DELETE and enter the guardian password.' });
        return;
      }

      const limitKey = `user:${userId}`;
      if (deletePasswordLimit.blocked(limitKey)) {
        res.status(429).json({ success: false, message: 'Too many wrong passwords. Please wait 15 minutes.' });
        return;
      }
      if (!(await this.authService.verifyPassword(userId, password))) {
        deletePasswordLimit.hit(limitKey);
        res.status(403).json({ success: false, message: 'The password is not correct.' });
        return;
      }

      deletePasswordLimit.clear(limitKey);
      await this.authService.deleteAccount(userId);

      res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account';
      res.status(500).json({ success: false, message });
    }
  };
}
