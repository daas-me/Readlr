import express, { Express } from 'express';
import cors from 'cors';
import { db } from './database/db.js';
import { audioRoutes } from './modules/audio/index.js';
import { healthRoutes } from './modules/health/index.js';
import { learnerRoutes } from './modules/learner/index.js';
import { contentRoutes } from './modules/content/index.js';
import { progressRoutes } from './modules/progress/index.js';
import { AuthService, AuthController, createAuthRouter } from './modules/auth/index.js';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize database
await db.initializeSchema();

// Initialize auth service and controller
const authService = new AuthService(db);
const authController = new AuthController(authService);

// Routes
app.use('/api/auth', createAuthRouter(authController));
app.use('/api/audio', audioRoutes);
app.use('/health', healthRoutes);
app.use('/api/learner', learnerRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/progress', progressRoutes);

export default app;
