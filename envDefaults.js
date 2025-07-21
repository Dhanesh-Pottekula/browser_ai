import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envDefaults = {
  agentUrl: process.env.AGENT_URL || "http://localhost:11434/api/generate",
  userDataDir: process.env.USER_DATA_DIR || null,
  browserPath: process.env.BROWSER_PATH || null,
  headless: process.env.HEADLESS === 'true' || false,
  channel: process.env.CHANNEL || 'chrome',
  model: process.env.MODAL_NAME
};
console.log(envDefaults);

export default envDefaults;