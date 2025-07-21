/**
 * Utility functions for making HTTP requests
 */

/**
 * Make a POST request to the Ollama API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request payload
 * @returns {Promise<Response>} - The fetch response
 */
export async function post(url, data) {
  console.log("posting to", url, data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

/**
 * Make a GET request
 * @param {string} url - The URL to fetch
 * @returns {Promise<Response>} - The fetch response
 */
export async function get(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export default {
  post,
  get
}; 