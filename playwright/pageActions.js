import DelayUtils from '../utils/delayUtils.js';

/**
 * Page Actions - Handles common page operations
 */
class PageActions {
  /**
   * Navigate to a URL
   * @param {Object} page - Playwright page object
   * @param {string} url - URL to navigate to
   * @param {Object} options - Navigation options
   */
  static async navigateTo(page, url, options = {}) {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000
    };

    const navOptions = { ...defaultOptions, ...options };

    try {
      await page.goto(url, navOptions);
    } catch (error) {
      throw new Error(`Failed to navigate to ${url}: ${error.message}`);
    }
  }

  /**
   * Click on an element
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {Object} options - Click options
   */
  static async click(page, selector, options = {}) {
    try {
      await DelayUtils.waitForElement(page, selector);
      await page.click(selector, options);
    } catch (error) {
      throw new Error(`Failed to click element ${selector}: ${error.message}`);
    }
  }

  /**
   * Type text into an input field
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {Object} options - Type options
   */
  static async type(page, selector, text, options = {}) {
    try {
      await DelayUtils.waitForElement(page, selector);
      await page.fill(selector, text, options);
    } catch (error) {
      throw new Error(`Failed to type in element ${selector}: ${error.message}`);
    }
  }

  /**
   * Get text content of an element
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @returns {Promise<string>} - Text content
   */
  static async getText(page, selector) {
    try {
      await DelayUtils.waitForElement(page, selector);
      return await page.textContent(selector);
    } catch (error) {
      throw new Error(`Failed to get text from element ${selector}: ${error.message}`);
    }
  }

  /**
   * Get attribute value of an element
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>} - Attribute value
   */
  static async getAttribute(page, selector, attribute) {
    try {
      await DelayUtils.waitForElement(page, selector);
      return await page.getAttribute(selector, attribute);
    } catch (error) {
      throw new Error(`Failed to get attribute ${attribute} from element ${selector}: ${error.message}`);
    }
  }

  /**
   * Wait for element to be visible
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForElement(page, selector, timeout = 10000) {
    await DelayUtils.waitForElement(page, selector, timeout);
  }

  /**
   * Take a screenshot
   * @param {Object} page - Playwright page object
   * @param {string} path - Screenshot path
   * @param {Object} options - Screenshot options
   */
  static async takeScreenshot(page, path, options = {}) {
    try {
      await page.screenshot({ path, ...options });
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error.message}`);
    }
  }

  /**
   * Get page title
   * @param {Object} page - Playwright page object
   * @returns {Promise<string>} - Page title
   */
  static async getTitle(page) {
    return await page.title();
  }

  /**
   * Get page URL
   * @param {Object} page - Playwright page object
   * @returns {Promise<string>} - Page URL
   */
  static async getUrl(page) {
    return page.url();
  }

  /**
   * Scroll to element
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   */
  static async scrollToElement(page, selector) {
    try {
      await page.scrollIntoViewIfNeeded(selector);
    } catch (error) {
      throw new Error(`Failed to scroll to element ${selector}: ${error.message}`);
    }
  }

  /**
   * Wait for network to be idle
   * @param {Object} page - Playwright page object
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(page, timeout = 5000) {
    await DelayUtils.waitForNetworkIdle(page, timeout);
  }
}

export default PageActions;