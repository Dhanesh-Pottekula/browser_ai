import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envDefaults = {
  agentUrl: process.env.AGENT_URL || "https://www.google.com",
  userDataDir: process.env.USER_DATA_DIR || null,
  browserPath: process.env.BROWSER_PATH || null,
  headless: process.env.HEADLESS === 'true' || false,
  channel: process.env.CHANNEL || 'chrome',
};
console.log(envDefaults);

export default envDefaults;