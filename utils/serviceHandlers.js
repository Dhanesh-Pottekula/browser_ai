import GeminiService from './geminiService.js';
import fetchUtils from './fetchUtils.js';

// Service initialization handlers
export const serviceInitializers = {
  "gemini-2.5-flash": () => {
    return new GeminiService();
  },
  "lamafile": () => {
    return null; // Uses fetchUtils
  },
  "deepseek-coder:6.7b": () => {
    return null; // Uses fetchUtils
  },
  "codellama:7b": () => {
    return null; // Uses fetchUtils
  },
  "gemma3:latest": () => {
    return null; // Uses fetchUtils
  },
  "llama3.2:latest": () => {
    return null; // Uses fetchUtils
  }
};

// Service call handlers
export const serviceCallHandlers = {
  "gemini-2.5-flash": async (service, message, url) => {
    const data = await service.generateContent(message);
    return data
  },
  "lamafile": async (service, message, url) => {
    const payload = {
      api_key: "",
      cache_prompt: true,
      frequency_penalty: 0,
      grammar: "",
      image_data: [],
      min_keep: 0,
      min_p: 0.05,
      mirostat: 0,
      mirostat_eta: 0.1,
      mirostat_tau: 5,
      n_predict: 400,
      n_probs: 0,
      presence_penalty: 0,
      prompt: "hi\n\nUser: \nLlama:" + message,
      repeat_last_n: 256,
      repeat_penalty: 1.18,
      slot_id: -1,
      stop: ["</s>", "Llama:", "User:"],
      stream: true,
      temperature: 0.7,
      tfs_z: 1,
      top_k: 40,
      top_p: 0.95,
      typical_p: 1,
      n_predict: 400,
      n_probs: 0,
      presence_penalty: 0,
      prompt: message,
      repeat_last_n: 256,
      repeat_penalty: 1.18,
      slot_id: -1,
      stop: ["</s>", "Llama:", "User:"],
      stream: false,
      temperature: 0.7,
      tfs_z: 1,
      top_k: 40,
      top_p: 0.95,
      typical_p: 1,
    };
    const response = await fetchUtils.post(url, payload);
    return await response.json();
  },
  "deepseek-coder:6.7b": async (service, message, url) => {
    const payload = {
      model: "deepseek-coder:6.7b",
      prompt: message,
      stream: false
    };
    const response = await fetchUtils.post(url, payload);
    return await response.json();
  },
  "codellama:7b": async (service, message, url) => {
    const payload = {
      model: "codellama:7b",
      prompt: message,
      stream: false
    };
    const response = await fetchUtils.post(url, payload);
    return await response.json();
  },
  "gemma3:latest": async (service, message, url) => {
    const payload = {
      model: "gemma3:latest",
      prompt: message,
      stream: false
    };
    const response = await fetchUtils.post(url, payload);
    return await response.json();
  },
  "llama3.2:latest": async (service, message, url) => {
    const payload = {
      model: "llama3.2:latest",
      prompt: message,
      stream: false
    };
    const response = await fetchUtils.post(url, payload);
    return await response.json();
  }
}; 

