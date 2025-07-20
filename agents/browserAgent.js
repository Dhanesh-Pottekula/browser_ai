const BaseAgent = require('./baseAgent');
const BrowserManager = require('../playwright/browserManager');
const PageActions = require('../playwright/pageActions');

/**
 * Browser Agent - Handles browser automation tasks
 */
class BrowserAgent extends BaseAgent {
  constructor(config = {}) {
    super(config);
    this.browserManager = new BrowserManager();
    this.currentPage = null;
  }

  /**
   * Initialize the browser agent
   */
  async initialize() {
    await super.initialize();
    this.log('Browser agent initialized');
  }

  /**
   * Launch browser with configuration
   * @param {Object} config - Browser configuration
   */
  async launchBrowser(config = {}) {
    try {
      const browserConfig = {
        userDataDir: config.userDataDir || './browser-data',
        browserPath: config.browserPath,
        headless: config.headless || false,
        channel: config.channel || 'chrome',
        ...config
      };

      const context = await this.browserManager.launchPersistentContext(browserConfig);
      this.currentPage = await this.browserManager.getPage(context);
      
      this.log('Browser launched successfully');
      return context;
    } catch (error) {
      this.log(`Failed to launch browser: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   * @param {Object} options - Navigation options
   */
  async navigateTo(url, options = {}) {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      await PageActions.navigateTo(this.currentPage, url, options);
      this.log(`Navigated to: ${url}`);
    } catch (error) {
      this.log(`Failed to navigate to ${url}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Type text with delay
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {number} delayMs - Delay between characters
   */
  async typeWithDelay(selector, text, delayMs = 200) {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      await PageActions.typeWithDelay(this.currentPage, selector, text, delayMs);
      this.log(`Typed text with delay: ${text}`);
    } catch (error) {
      this.log(`Failed to type text: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   * @param {Object} options - Click options
   */
  async click(selector, options = {}) {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      await PageActions.click(this.currentPage, selector, options);
      this.log(`Clicked element: ${selector}`);
    } catch (error) {
      this.log(`Failed to click element ${selector}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Get text from an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} - Text content
   */
  async getText(selector) {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      const text = await PageActions.getText(this.currentPage, selector);
      this.log(`Got text from element: ${selector}`);
      return text;
    } catch (error) {
      this.log(`Failed to get text from element ${selector}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Take a screenshot
   * @param {string} path - Screenshot path
   * @param {Object} options - Screenshot options
   */
  async takeScreenshot(path, options = {}) {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      await PageActions.takeScreenshot(this.currentPage, path, options);
      this.log(`Screenshot saved to: ${path}`);
    } catch (error) {
      this.log(`Failed to take screenshot: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Get current page information
   * @returns {Promise<Object>} - Page information
   */
  async getPageInfo() {
    if (!this.currentPage) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    try {
      const title = await PageActions.getTitle(this.currentPage);
      const url = await PageActions.getUrl(this.currentPage);
      
      return {
        title,
        url,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.log(`Failed to get page info: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Process a browser task
   * @param {Object} task - Task to process
   */
  async processTask(task) {
    this.currentTask = task;
    
    try {
      switch (task.type) {
        case 'navigate':
          await this.navigateTo(task.url, task.options);
          break;
        case 'type':
          await this.typeWithDelay(task.selector, task.text, task.delayMs);
          break;
        case 'click':
          await this.click(task.selector, task.options);
          break;
        case 'screenshot':
          await this.takeScreenshot(task.path, task.options);
          break;
        case 'getText':
          return await this.getText(task.selector);
        case 'getPageInfo':
          return await this.getPageInfo();
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
    } finally {
      this.currentTask = null;
    }
  }

  /**
   * Close browser
   */
  async closeBrowser() {
    try {
      await this.browserManager.closeContext();
      this.currentPage = null;
      this.log('Browser closed');
    } catch (error) {
      this.log(`Failed to close browser: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Stop the agent and close browser
   */
  async stop() {
    await this.closeBrowser();
    await super.stop();
  }

  /**
   * Get agent status including browser status
   * @returns {Object} - Agent status
   */
  getStatus() {
    const baseStatus = super.getStatus();
    return {
      ...baseStatus,
      browserRunning: this.browserManager.isRunning(),
      currentPage: this.currentPage ? 'active' : 'none'
    };
  }
}

module.exports = BrowserAgent; 