import envDefaults from '../envDefaults.js';
import { planningPrompt } from '../constants/modalPrompts.js';
import { serviceInitializers, serviceCallHandlers } from '../utils/serviceHandlers.js';

class AiAgent {
  constructor(config = {}) {
    this.config = {
      maxRetries:  3,
      ...config
    };
    
    this.url = envDefaults.agentUrl;
    this.model = envDefaults.model;
    
    // Initialize service based on model
    const serviceInitializer = serviceInitializers[this.model];
    if (serviceInitializer) {
      this.service = serviceInitializer();
    }
    
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
    this.planResponse = null;
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
    if(this.failureCount > 3){
      throw new Error('Agent is busy');
    }
    this.status = 'busy';
    try {
      // Get the appropriate service call handler
      const serviceCallHandler = serviceCallHandlers[this.model];
      if (!serviceCallHandler) {
        throw new Error(`No service handler found for model: ${this.model}`);
      }
      // Call the service using the handler
      // const data = await serviceCallHandler(this.service, message, this.url);
      this.successCount++;
      this.status = 'idle';
      this.lastError = null;
      return {}      
    } catch (error) {
      this.failureCount++;
      this.status = 'error';
      this.lastError = error.message;
      
      throw error;
    }
  }

  async plan(userPrompt) {
    this.userPrompt = userPrompt;
    const plan = planningPrompt(userPrompt);
    const planResponse = await this.callAgent(plan);
    if(planResponse?.response_status === "success"){
      this.planResponse = planResponse;
      return this.planResponse;
    }
    throw new Error(planResponse);
  }
  
  async ping() {
    const response = await this.callAgent("hello, say just hello");
    console.log("response", response);
    return response;
  }
}

export default AiAgent;