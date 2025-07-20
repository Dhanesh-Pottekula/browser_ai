const { chromium } = require("playwright");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function launchBrowserWithConfig({ browserPath, userDataDir, apiKey, useLocalModel }) {

  const browser = await chromium.launchPersistentContext(
    userDataDir,
    {
      headless: false,
      channel: 'chrome', // Uses full Chrome, not bundled Chromium
    }
  );
  
  let page = browser.pages().at(0);
  if (!page) page = await browser.newPage();
  
  await page.goto("https://www.google.com");

  // Example: type slowly
  await page.click("input[name='q']");
  for (const char of "Hello from AI") {
    await page.keyboard.type(char);
    await delay(200); // 200ms between keystrokes
  }
}

module.exports = { launchBrowserWithConfig };
