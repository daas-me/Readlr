import { Database } from '../../database/db.js';

export class UploadService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async updateAvatarUrl(userId: number, avatarUrl: string | null): Promise<void> {
    await this.db.run(
      `UPDATE learner_profiles SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [avatarUrl, userId]
    );
  }

  async getAvatarUrl(userId: number): Promise<string | null> {
    const row = await this.db.get(
      `SELECT avatar_url FROM learner_profiles WHERE user_id = ?`,
      [userId]
    );
    return row?.avatar_url ?? null;
  }
}