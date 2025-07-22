import {chromium} from 'playwright';

/**
 * Browser Manager - Handles browser launch and context management
 */
class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
  }

  /**
   * Launch browser with persistent context
   * @param {Object} config - Browser configuration
   * @param {string} config.userDataDir - User data directory
   * @param {string} config.browserPath - Path to browser executable
   * @param {boolean} config.headless - Whether to run in headless mode
   * @param {string} config.channel - Browser channel (chrome, firefox, etc.)
   * @returns {Promise<Object>} - Browser context
   */
  async launchPersistentContext(config = {}) {
    const {
      userDataDir,
      browserPath,
      headless = false,
      channel = 'chrome',
      ...otherOptions
    } = config;

    const launchOptions = {
      headless,
      channel,
      ...otherOptions
    };

    if (browserPath) {
      launchOptions.executablePath = browserPath;
    }

    try {
      this.context = await chromium.launchPersistentContext(
        userDataDir,
        launchOptions
      );

      return this.context;
    } catch (error) {
      throw new Error(`Failed to launch browser: ${error.message}`);
    }
  }

  /**
   * Launch new browser instance without user data
   * @param {Object} config - Browser configuration
   * @param {string} config.browserPath - Path to browser executable
   * @param {boolean} config.headless - Whether to run in headless mode
   * @param {string} config.channel - Browser channel (chrome, firefox, etc.)
   * @returns {Promise<Object>} - Browser context
   */
  async launchBrowser(config = {}) {
    const {
      headless = false,
      channel = 'chrome',
      ...otherOptions
    } = config;

    const launchOptions = {
      headless,
      channel,
      ...otherOptions
    };
    try {
      this.browser = await chromium.launch(launchOptions);
      this.context = await this.browser.newContext();

      return this.context;
    } catch (error) {
      throw new Error(`Failed to launch browser: ${error.message}`);
    }
  }

  /**
   * Get or create a new page
   * @param {Object} context - Browser context
   * @returns {Promise<Object>} - Page object
   */
  async getPage() {
    const pages = this.context.pages();
    let page = pages.length > 0 ? pages[0] : null;

    if (!page) {
      page = await this.context.newPage();
    }
    return page;
  }

  /**
   * Close browser context
   */
  async closeContext() {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }

  /**
   * Close browser instance
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }

  /**
   * Get browser context
   * @returns {Object|null} - Browser context
   */
  getContext() {
    return this.context;
  }

  /**
   * Check if browser is running
   * @returns {boolean} - Whether browser is running
   */
  isRunning() {
    return this.context !== null;
  }
}

export default BrowserManager;