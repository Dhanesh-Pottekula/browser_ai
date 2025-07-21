import BrowserManager from '../playwright/browserManager.js';
import PageActions from '../playwright/pageActions.js';
import envDefaults from '../envDefaults.js';
import AiAgent from '../agents/aiAgentClass.js';

const aiAgent = new AiAgent();
const browserManager = new BrowserManager();


//launch browser with config
export async function launchBrowserWithConfig({ url }) {
  const browser = await browserManager.launchPersistentContext({
    userDataDir: envDefaults.userDataDir,
    browserPath: envDefaults.browserPath,
    headless: envDefaults.headless,
    channel: envDefaults.channel
  });

  const page = await browserManager.getPage(browser);
  await PageActions.navigateTo(page, url);
}

export async function pingAgent(){
  const plan = await aiAgent.ping();
  return plan;
}

