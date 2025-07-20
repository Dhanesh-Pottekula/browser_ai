import BrowserManager from '../playwright/browserManager.js';
import PageActions from '../playwright/pageActions.js';
import envDefaults from '../envDefaults.js';

const browserManager = new BrowserManager();
export async function launchBrowserWithConfig({ url }) {

  
  const browser = await browserManager.launchPersistentContext({
    userDataDir: envDefaults.userDataDir,
    browserPath: envDefaults.browserPath,
    headless: envDefaults.headless,
    channel: envDefaults.channel
  });

  const page = await browserManager.getPage(browser);
  await PageActions.navigateTo(page, url);
  await PageActions.click(page, "input[name='q']");
  await PageActions.type(page, "input[name='q']", "Hello from AI");
  await PageActions.press(page, "input[name='q']", "Enter");
  await PageActions.takeScreenshot(page, "screenshot.png");
  await browserManager.closeContext();

}


