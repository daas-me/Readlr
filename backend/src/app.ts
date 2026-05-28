import express, { Express } from 'express';
import cors from 'cors';
import { db } from './database/db.js';
import { audioRoutes } from './modules/audio/index.js';
import { healthRoutes } from './modules/health/index.js';
import { learnerRoutes } from './modules/learner/index.js';
import { contentRoutes } from './modules/content/index.js';
import { progressRoutes } from './modules/progress/index.js';
import { characterRouter, characterService } from './modules/character/index.js';
import { AuthService, AuthController, createAuthRouter } from './modules/auth/index.js';
import { uploadRouter } from './modules/upload/upload.router.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
app.use('/api/characters', characterRouter);
app.use('/api/upload', uploadRouter);

// Initialize default characters
await characterService.initializeDefaultCharacters();

export default app;
