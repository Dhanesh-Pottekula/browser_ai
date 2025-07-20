import envDefaults from '../envDefaults.js';
import fetchUtils from '../utils/fetchUtils.js';

class AiAgent {
  constructor(config = {}) {
    this.config = config;
    this.url =envDefaults.agentUrl;
  }

  async callAgent(message) {
    fetchUtils
      .post(this.url, {
        message: message
      })
      .then(response => response.json())
      .then(data => {
        return data;
      });
  }
}

export default AiAgent;