import BrowserManager from '../playwright/browserManager.js';
import PageActions from '../playwright/pageActions.js';

const browserManager = new BrowserManager();
const pageActions = new PageActions();
export async function launchBrowserWithConfig({ browserPath, userDataDir, apiKey, useLocalModel }) {
  const browser = await browserManager.launchPersistentContext({
    userDataDir,
    browserPath
  });

  const page = await browserManager.getPage(browser);
  await pageActions.goto(page, "https://www.google.com");
  await pageActions.click(page, "input[name='q']");
  await pageActions.type(page, "Hello from AI");
  await pageActions.press(page, "Enter");
  await pageActions.waitForTimeout(page, 1000);
  await pageActions.screenshot(page, "screenshot.png");

}


