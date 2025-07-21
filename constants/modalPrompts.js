export const planningPrompt = (userPrompt) => `
You are a task planning assistant for browser automation tasks like job applications and content extraction.

User Request: "${userPrompt}"

Generate a step-by-step plan with the following JSON structure:
{
  "response_status": "success | failure",
  "goal": "Brief summary of the task to achieve",
  "steps": [
    {
      "id": "step_1",
      "title": "Concise title of the step",
      "action": "Describe the user intent or UI interaction clearly (e.g., locate the search bar, click the 'Apply' button)",
      "expectedOutcome": "What should happen if this step works",
      "errorHandling": "Fallback plan if the UI element is not found, not clickable, or delayed (e.g., retry, use alternative selector, wait longer)"
    }
  ],
  "dependencies": ["step_2 depends on step_1"]
}


Guidelines:
- Each action should be high-level and understandable by another LLM.
- Include realistic fallback suggestions.
- Return only the JSON object, no extra text.
`;

export const executePlanPrompt = (plan, currentStep, domElements) => `
You are a task execution assistant for browser automation tasks like job applications or content extraction.

Your job is to simulate executing the current step from a previously generated plan using the given DOM snapshot. Some steps may require multiple sub-actions (e.g., filling multiple form fields). Respond in this strict JSON structure:

{
  "response_status": "success | failure",
  "type": "automation | extraction",
  "goal": "Brief summary of what this plan is accomplishing",
  "stepId": "ID of the current step",
  "stepTitle": "Title of the current step",
  "stepStatus": "completed | failed | retry",
  "allStepsCompleted": true | false,
  "stopAgent": true | false,
  "nextStepId": "ID or description of the next action within this step (optional, only if stepStatus is retry)",
  "playwright": {
    "type": "click | fill | navigate | wait | extract | press",
    "selector": "CSS/XPath selector or property that can be used to target this element",
    "value": "value to use if applicable (e.g., for fill or press)"
  },
  "errorHandling": "Fallback or retry logic if the step fails"
}

Guidelines:
- Focus primarily on the Current Step and DOM Snapshot.
- Use DOM to resolve the most appropriate action (e.g., which field to fill next).
- For multi-part steps like filling forms:
  - Return "stepStatus": "retry" until the entire form is completed
  - Include "nextSubStepId" to indicate the next field or sub-task
- If the required element isn't present:
  - Set "stepStatus": "failed"
  - Set "stopAgent": true
  - Add proper fallback logic in "errorHandling"
- Use:
  - "type": "automation" for interactions
  - "type": "extraction" for data scraping
- Always break the action into:
  - "playwright.type": click, fill, press, etc.
  - "selector": specific element identifier
  - "value": only for fill/press types
- Use concise selectors like:
  - 'input[placeholder="Email"]'
  - 'button:has-text("Submit")'
- Set "response_status": "failure" only if no valid action can be derived
- Set "stopAgent": true only if the task can no longer continue
- Set "allStepsCompleted": false unless this is the final action

---

Task Plan:
\`\`\`json
${JSON.stringify(plan, null, 2)}
\`\`\`

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
  "response_status": "success",
  "goal": "Fill out a job application form on a company website",
  "steps": [
    {
      "id": "step_1",
      "title": "Navigate to the job application page",
      "action": "Open the browser and navigate to the company website's job application page",
      "expectedOutcome": "The webpage should load successfully",
      "errorHandling": "Retry navigation if failed, or use alternative URL"
    },
    {
      "id": "step_2",
      "title": "Fill out the required fields",
      "action": "Locate and fill out the required field names and values (e.g., job title, location)",
      "expectedOutcome": "The form should be populated correctly",
      "errorHandling": "Retry filling if failed or use default values"
    }
  ],
  "dependencies": ["step_1"]
}