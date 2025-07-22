import BrowserManager from "../playwright/browserManager.js";
import PageActions from "../playwright/pageActions.js";
import envDefaults from "../envDefaults.js";
import AiAgent from "../agents/aiAgentClass.js";
import { demoPlan, executePlanPrompt } from "../constants/modalPrompts.js";
import DelayUtils from "../utils/delayUtils.js";

const aiAgent = new AiAgent();
const browserManager = new BrowserManager();

//launch browser with config
export async function launchBrowserWithConfig({ url }) {
  await browserManager.launchPersistentContext({
    userDataDir: envDefaults.userDataDir,
    browserPath: envDefaults.browserPath,
    headless: envDefaults.headless,
    channel: envDefaults.channel,
  });

  const page = await browserManager.getPage();
  if (url) {
    await PageActions.navigateTo(page, url);
  }
}
export async function launchBrowserWithoutProfile({ url }) {
  await browserManager.launchBrowser({
    headless: envDefaults.headless,
    channel: envDefaults.channel,
  });

  const page = await browserManager.getPage();
  if (url) {
    await PageActions.navigateTo(page, url);
  }
}

export async function pingAgent() {
  const plan = await aiAgent.ping();
  return plan;
}

// Helper function to execute AI agent with retry logic
async function executeAgentWithRetry(currentStep, maxFailures) {
  const page = await browserManager.getPage();
  let failures = 0;
  while (failures < maxFailures) {
    const snapshot = (await PageActions.getCleanedHTML(page)) || "";
    const executePlan = await executePlanPrompt(
      currentStep,
      snapshot.trim(),
      aiAgent.history
    );
    const executePlanResponse = await aiAgent.callAgent(executePlan);
    console.log(executePlanResponse);
    if (executePlanResponse?.response_status === "success") {
      return executePlanResponse;
    }
    if (
      executePlanResponse?.playwrightActions &&
      Array.isArray(executePlanResponse?.playwrightActions) &&
      executePlanResponse?.playwrightActions.length > 0
    ) {
      for (const action of executePlanResponse?.playwrightActions) {
        await executePlaywrightAction(page, action);
      }
      continue;
    }

    failures++;
    if (failures < maxFailures) {
      const page = await browserManager.getPage();
      await PageActions.scrollDown(page, 500);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  return null;
}

// Helper function to execute Playwright actions
async function executePlaywrightAction(page, action) {
  const { type, selector, value } = action;

  switch (type) {
    case "click":
      await PageActions.click(page, selector);
      break;
    case "fill":
      await PageActions.type(page, selector, value);
      break;
    case "navigate":
      await PageActions.navigateTo(page, value);
      break;
    case "wait":
      await PageActions.waitForElement(page, selector);
      break;
    case "press":
      await PageActions.press(page, selector, value);
      break;
    case "scrollToElement":
      await PageActions.scrollToElement(page, selector);
      break;
    case "scroll":
      await PageActions.scrollDown(page, value);
      break;
    case "extract":
      // Handle extract action if needed
      break;
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

// Helper function to handle step execution
async function executeStep(currentStep, maxFailures) {
  const page = await browserManager.getPage();

  const executePlanResponse = await executeAgentWithRetry(
    currentStep,
    maxFailures
  );

  if (
    executePlanResponse?.playwrightActions &&
    Array.isArray(executePlanResponse?.playwrightActions) &&
    executePlanResponse?.playwrightActions.length > 0
  ) {
    for (const action of executePlanResponse.playwrightActions) {
      await executePlaywrightAction(page, action);
      await DelayUtils.delay(3000);
    }
  }
  if (executePlanResponse?.allStepsCompleted) {
    await browserManager.closeContext();
    return { shouldContinue: false, allStepsCompleted: true };
  }

  return { shouldContinue: true, allStepsCompleted: false };
}

export async function planAndExecute(userPrompt) {
  try {
    // const plan = demoPlan;
    const plan = await aiAgent.plan(userPrompt)
    // console.log(plan)
    let currentStepIndex = 0;
    const maxFailures = 1;
    while (currentStepIndex < plan.steps.length) {
      const currentStep = plan.steps[currentStepIndex];
      const result = await executeStep(currentStep, maxFailures);
      if (!result.shouldContinue) {
        return plan;
      }
      currentStepIndex++;
      await DelayUtils.delay(3000);
    }
    return plan;
  } catch (error) {
    aiAgent.reset();
    return { error: error.message };
  }
}
