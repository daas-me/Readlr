/**
 * Stage & Level Module Types
 */

export interface StageResponse {
  id: number;
  stage_number: number;
  title: string;
  description: string;
  difficulty: number;
  created_at: string;
}

export interface LevelResponse {
  id: number;
  stage_id: number;
  level_number: number;
  title: string;
  description: string;
  target_phoneme: string;
  difficulty: number;
  created_at: string;
}

export interface StageWithLevelsResponse extends StageResponse {
  levels: LevelResponse[];
}
