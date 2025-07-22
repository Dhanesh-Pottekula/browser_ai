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
- Be thorough: include navigation, input, clicks, waits etc.
- Use clear and high-level descriptions suitable for another agent to execute.

Return only the plain JSON object.`;


export const executePlanPrompt = (currentStep, domElements,history) => `
You are a task execution assistant for browser automation tasks like job applications or content extraction.

Your job is to simulate executing the current step from a plan using the given DOM snapshot. Respond using the **strict JSON format** below **ONLY** — do not include any extra text, explanations, or markdown:

{
  "response_status": "success | failure",
  "type": "automation | extraction",
  "stepTitle": "Title of the current step",
  "stepStatus": "completed | retry",
  "allStepsCompleted": true | false,
  "stopAgent": true | false,
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
- Always return selectors that can be directly used in Playwright.
- If the required element is missing or ambiguous:
  - Set "response_status": "failure"
  - Set "stopAgent": true
- Return **exactly one valid JSON object**, no markdown, no extra explanations.
- Do not wrap your response in \`\`\`json or any other code block.
- Output only the final JSON.

Current Step:
${JSON.stringify(currentStep, null, 2)}

DOM Snapshot:
${domElements}

History:
${history}
`;

export const demoPlan = {
  response_status: 'success',
  goal: "Navigate to the documentation section by clicking on the 'Docs' link in the header of the currently opened page.",
  steps: [
    {
      id: '1',
      action: "Locate the 'Docs' link or button within the header section of the current page. Prioritize elements with text 'Docs' or 'Documentation' and a 'link' or 'button' role.",
      expectedOutcome: "The 'Docs' element should be found and identifiable.",
      errorHandling: `If not found, try alternative selectors like 'a[href*="docs"]' or 'button[aria-label*="docs"]'. If still not found, report failure.`
    },
    {
      id: '2',
      action: "Click on the identified 'Docs' link or button.",
      expectedOutcome: 'The browser should navigate to the documentation section of the website.',
      errorHandling: "If the click fails (e.g., element not interactable), wait for a short period and retry. If navigation doesn't occur, check for modals or overlays preventing the click. Report failure if still unsuccessful."
    },
    {
      id: '3',
      action: "Verify that the URL has changed to reflect the documentation section (e.g., contains '/docs' or similar path) and the content on the page is related to documentation.",
      expectedOutcome: 'The page content should be the documentation section.',
      errorHandling: "If the URL or content doesn't change as expected, it indicates the click was unsuccessful or led to an incorrect page. Report failure."
    }
  ],
  dependencies: [ 'step_2 depends on step_1', 'step_3 depends on step_2' ]
}


export const  demoResponse={
  response_status: "success",
  playwrightActions: [
    { type: 'click', selector: 'header >> text=Docs' }
  ],
};