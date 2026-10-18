import dotenv from 'dotenv';

dotenv.config();

function getCorsOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) return configuredOrigins;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('CORS_ORIGIN is required in production.');
  }

  return ['http://localhost:5173'];
}

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: getCorsOrigins(),
  readlr2CampEnabled: process.env.READLR2_CAMP_ENABLED?.trim().toLowerCase() !== 'false',
  readlr2TesterEmails: (process.env.READLR2_TESTER_EMAIL_ALLOWLIST ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  readlr2CampCurriculumVersion: process.env.READLR2_CAMP_CURRICULUM_VERSION?.trim() || 'readlr-aral-english-1',
  readlr2CampMediaVersion: process.env.READLR2_CAMP_MEDIA_VERSION?.trim() || 'readlr-existing-models-tts-1',
};

export default config;
