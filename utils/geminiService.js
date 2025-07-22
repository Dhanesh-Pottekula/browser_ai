import { GoogleGenerativeAI } from "@google/generative-ai";
import envDefaults from "../envDefaults.js";

class GeminiService {
  constructor() {
    this.apiKey = envDefaults.llmApiKey;
    if (!this.apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }

    this.ai = new GoogleGenerativeAI(this.apiKey);
    this.model = this.ai.getGenerativeModel({
      model: envDefaults.model, // e.g., "gemini-2.5-flash"
    });
  }

  async generateContent(message) {
    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];
    console.log("calling gemini");
    const response = await this.model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const rawText = await response.response.text();
    const text = JSON.parse(rawText);
    return text;
  }

  async ping() {
    return this.generateContent("Hello! Just say 'Hello' back.");
  }
}

export default GeminiService;
