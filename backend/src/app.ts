import express, { Express } from 'express';
import cors from 'cors';
import { audioRoutes } from './modules/audio/index.js';
import { healthRoutes } from './modules/health/index.js';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/audio', audioRoutes);
app.use('/health', healthRoutes);

export default app;
