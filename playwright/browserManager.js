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
   * Get or create a new page
   * @param {Object} context - Browser context
   * @returns {Promise<Object>} - Page object
   */
  async getPage(context) {
    let page = context.pages().at(0);
    if (!page) {
      page = await context.newPage();
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