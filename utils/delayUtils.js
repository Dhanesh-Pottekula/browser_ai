/**
 * Utility functions for delays and timing
 */

class DelayUtils {
  /**
   * Create a delay for specified milliseconds
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  static async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Type text with a delay between characters
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {number} delayMs - Delay between characters in milliseconds
   */
  static async typeWithDelay(page, selector, text, delayMs = 200) {
    await page.click(selector);
    for (const char of text) {
      await page.keyboard.type(char);
      await this.delay(delayMs);
    }
  }

  /**
   * Wait for element to be visible
   * @param {Object} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForElement(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for network to be idle
   * @param {Object} page - Playwright page object
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForNetworkIdle(page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }
}

export default DelayUtils; 