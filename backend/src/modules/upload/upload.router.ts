import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { UploadService } from './upload.service.js';
import { db } from '../../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store uploaded files in backend/uploads/avatars/
const uploadDir = path.join(__dirname, '../../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const uploadService = new UploadService(db);
const router = express.Router();

// POST /api/upload/avatar
// Expects: multipart/form-data with field "avatar" + header x-user-id
router.post('/avatar', upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers['x-user-id']);
    if (!userId || isNaN(userId)) {
      res.status(400).json({ error: 'Missing user id' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Delete old avatar file if one exists
    const oldUrl = await uploadService.getAvatarUrl(userId);
    if (oldUrl) {
      const oldPath = path.join(__dirname, '../../../', oldUrl.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save relative URL that the frontend can use
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await uploadService.updateAvatarUrl(userId, avatarUrl);

    res.json({ avatarUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/upload/avatar
// Reverts back to emoji avatar
router.delete('/avatar', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.headers['x-user-id']);
    if (!userId || isNaN(userId)) {
      res.status(400).json({ error: 'Missing user id' });
      return;
    }

    // Delete the file from disk
    const oldUrl = await uploadService.getAvatarUrl(userId);
    if (oldUrl) {
      const oldPath = path.join(__dirname, '../../../', oldUrl.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await uploadService.updateAvatarUrl(userId, null);
    res.json({ message: 'Avatar removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as uploadRouter };