export const planningPrompt = (userPrompt) => `
You are an expert task planner for browser automation. You generate a structured JSON plan for user requests related to browser actions like navigation, clicking, typing, scrolling, and interacting with UI elements.

Your goal is to return ONLY a valid JSON object (no markdown formatting like \`\`\`, no explanations, no extra text) that follows the format below.

---

User Request: "${userPrompt}"

---

Respond ONLY with a valid JSON object using this exact format:

{
  "response_status": "success", // or "failure" if the task is ambiguous or incomplete
  "goal": "Brief but complete summary of the user's task",
  "steps": [
    {
      "id": "1",
      "action": "Describe the action (e.g., locate the search bar and enter the query)",
      "expectedOutcome": "What should happen if this step is successful",
      "errorHandling": "What to do if this step fails (e.g., retry, wait, use alternate selector)"
    }
    // Add more steps as needed
  ],
  "dependencies": [
    // e.g., "step_2 depends on step_1"
  ]
}

Guidelines:
- Do not wrap the JSON in triple backticks or any formatting.
- Do not add any explanation or commentary.
- Ensure the JSON is syntactically valid and complete.
- Be thorough: include navigation, input, clicks, waits, error recovery, etc.
- Use clear and high-level descriptions suitable for another agent to execute.

Return only the plain JSON object.`;


export const executePlanPrompt = (currentStep, domElements) => `
You are a task execution assistant for browser automation tasks like job applications or content extraction.

Your job is to simulate executing the current step from a plan using the given DOM snapshot. Respond using the strict JSON format below:

{
  "response_status": "success | failure",
  "type": "automation | extraction",
  "stepId": "ID of the current step",
  "stepTitle": "Title of the current step",
  "stepStatus": "completed | retry",
  "allStepsCompleted": true | false,
  "stopAgent": true | false,
  "nextStepId": "ID of the next field or sub-step within the same current step (if stepStatus is retry)",
  "playwrightActions": [
    {
      "type": "click | fill | navigate | wait | extract | press",
      "selector": "CSS/XPath selector or property that can be used to target this element",
      "value": "value to use if applicable (e.g., for fill, press, or the URL for navigate)"
    }
  ],
  "errorHandling": "Fallback or retry logic if the step fails"
}

Guidelines:
- Focus ONLY on the current step and the DOM snapshot.
- Your goal is to map the step's action to a **sequence of Playwright-compatible interactions** using the DOM.
- You MUST identify and return **usable selectors** (CSS/XPath) and **values** to drive the automation.
- Always include a navigation step if the goal involves a new URL:  
  e.g., { "type": "navigate", "selector": null, "value": "https://example.com" }
- For actions like clicking, filling forms, or extracting data, return selectors that can be directly used in Playwright.
- If the required elements are missing or ambiguous:
  - Set "response_status": "failure"
  - Set "stopAgent": true
- Always break down the interaction into discrete steps:
  - Each with "type", "selector", and "value"
- Use:
  - "type": "automation" for UI interactions
  - "type": "extraction" for data scraping
- Use concise selectors like 'input[placeholder="Email"]', 'button:has-text("Submit")'
- Return ONLY the JSON response — no explanations, no comments

---

Current Step:
\`\`\`json
${JSON.stringify(currentStep, null, 2)}
\`\`\`

DOM Snapshot:
\`\`\`html
${domElements}
\`\`\`
`;



export const demoPlan = {
  response_status: 'success',
  goal: "Navigate to Google, search for 'React articles', and click the first search result.",
  steps: [
    {
      id: '1',
      action: "Navigate the browser to the URL 'http://google.com'.",
      expectedOutcome: 'The Google search homepage is successfully loaded and visible.',
      errorHandling: 'If navigation fails, retry after a short delay. If persistent, report network issue or incorrect URL.'
    },
    {
      id: '2',
      action: "Locate the search input field on the Google homepage (e.g., by its 'name' attribute 'q' or 'aria-label' 'Search') and type the query 'React articles' into it.",
      expectedOutcome: "The text 'React articles' is visible within the search input field.",
      errorHandling: 'If the search input field is not found, wait for a few seconds and retry locating it. If still not found, try alternative selectors or report the element missing.'
    },
    {
      id: '3',
      action: "Submit the search query by either pressing the 'Enter' key while the search input is focused, or by clicking the 'Google Search' button (e.g., by its 'name' attribute 'btnK').",
      expectedOutcome: "The browser navigates to the search results page for 'React articles'.",
      errorHandling: 'If the search results page does not load, wait for a few seconds and check for network activity. If persistent, retry submitting the query. If the button is not found, try pressing Enter.'
    },
    {
      id: '4',
      action: "Locate the first search result link on the search results page (typically an 'a' tag within an 'h3' tag or similar structure, usually the first one with a distinct class like 'LC20lb' or 'r') and click it.",
      expectedOutcome: 'The browser navigates to the webpage corresponding to the first search result.',
      errorHandling: 'If the first search result link is not found, wait for the page to fully load and retry locating it. If still not found, try selecting the first visible link that appears to be a main search result. If no links are found, report failure to find search results.'
    }
  ],
  dependencies: [
    'step_2 depends on step_1',
    'step_3 depends on step_2',
    'step_4 depends on step_3'
  ]
}