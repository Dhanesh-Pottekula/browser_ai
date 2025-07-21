import envDefaults from '../envDefaults.js';
import fetchUtils from '../utils/fetchUtils.js';
import { planningPrompt } from '../constants/modalPrompts.js';

class AiAgent {
  constructor(config = {}) {
    this.config = {
      maxRetries:  3,
      ...config
    };
    
    this.url = envDefaults.agentUrl;
    this.model = envDefaults.model;
    // Simple state tracking
    this.status = 'idle'; // idle, busy, error
    this.failureCount = 0;
    this.successCount = 0;
    
    // Simple history
    this.history = [];
    
    // Last error
    this.lastError = null;

    this.planningPrompt = null;
    this.userPrompt = null;
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      status: this.status,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastError: this.lastError,
      historySize: this.history.length
    };
  }

  /**
   * Add to history
   */
  addToHistory(entry) {
    this.history.push({
      timestamp: new Date().toISOString(),
      ...entry
    });
    
    // Keep only last 50 entries
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  /**
   * Get history
   */
  getHistory() {
    return this.history;
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Reset everything
   */
  reset() {
    this.status = 'idle';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastError = null;
    this.clearHistory();
  }

  /**
   * Reset only failures
   */
  resetFailures() {
    this.failureCount = 0;
    this.lastError = null;
    this.status = 'idle';
  }

  /**
   * Main method to call the AI agent
   */
  async callAgent(message) {
    if (this.status === 'busy') {
      throw new Error('Agent is busy');
    }
    this.status = 'busy';
    try {
      // Format payload to match Ollama API
      const payload = {
        model: this.model,
        prompt: message,
        stream: false
      };
      const response = await fetchUtils.post(this.url, payload);
      const data = await response.json();
      console.log("response", data?.response);
      
      this.successCount++;
      this.status = 'idle';
      this.lastError = null;
      
      return data?.response;
      
    } catch (error) {
      this.failureCount++;
      this.status = 'error';
      this.lastError = error.message;
      
      throw error;
    }
  }

  async plan(userPrompt) {
    this.userPrompt = userPrompt;
    this.planningPrompt = planningPrompt(userPrompt);
    return this.callAgent(this.planningPrompt);
  }
  
  async ping() {
    return this.callAgent("hello, how are you?");
  }
}

export default AiAgent;