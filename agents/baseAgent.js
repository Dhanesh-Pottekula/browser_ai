const FetchUtils = require('../utils/fetchUtils');

/**
 * Base Agent Class - Provides common functionality for all agents
 */
class BaseAgent {
  constructor(config = {}) {
    this.config = {
      apiKey: null,
      useLocalModel: false,
      modelEndpoint: null,
      ...config
    };
    
    this.isActive = false;
    this.currentTask = null;
  }

  /**
   * Initialize the agent
   */
  async initialize() {
    this.isActive = true;
    console.log(`${this.constructor.name} initialized`);
  }

  /**
   * Stop the agent
   */
  async stop() {
    this.isActive = false;
    this.currentTask = null;
    console.log(`${this.constructor.name} stopped`);
  }

  /**
   * Make API call to LLM
   * @param {Object} payload - Request payload
   * @returns {Promise<Object>} - API response
   */
  async callLLM(payload) {
    if (!this.config.apiKey && !this.config.useLocalModel) {
      throw new Error('API key required for external LLM calls');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await FetchUtils.post(
        this.config.modelEndpoint,
        payload,
        headers
      );

      return response;
    } catch (error) {
      throw new Error(`LLM API call failed: ${error.message}`);
    }
  }

  /**
   * Process a task (to be implemented by subclasses)
   * @param {Object} task - Task to process
   */
  async processTask(task) {
    throw new Error('processTask method must be implemented by subclass');
  }

  /**
   * Get agent status
   * @returns {Object} - Agent status
   */
  getStatus() {
    return {
      name: this.constructor.name,
      isActive: this.isActive,
      currentTask: this.currentTask,
      config: this.config
    };
  }

  /**
   * Update agent configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Validate configuration
   * @returns {boolean} - Whether configuration is valid
   */
  validateConfig() {
    if (!this.config.useLocalModel && !this.config.apiKey) {
      return false;
    }
    return true;
  }

  /**
   * Log agent activity
   * @param {string} message - Log message
   * @param {string} level - Log level (info, warn, error)
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.constructor.name}] [${level.toUpperCase()}] ${message}`);
  }
}

module.exports = BaseAgent; 