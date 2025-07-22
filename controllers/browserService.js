import BrowserManager from '../playwright/browserManager.js';
import PageActions from '../playwright/pageActions.js';
import envDefaults from '../envDefaults.js';
import AiAgent from '../agents/aiAgentClass.js';
import { demoPlan, executePlanPrompt } from '../constants/modalPrompts.js';

const aiAgent = new AiAgent();
const browserManager = new BrowserManager();

//launch browser with config
export async function launchBrowserWithConfig({ url }) {
 await browserManager.launchPersistentContext({
    userDataDir: envDefaults.userDataDir,
    browserPath: envDefaults.browserPath,
    headless: envDefaults.headless,
    channel: envDefaults.channel
  });

  const page = await browserManager.getPage();
  if( url){
    await PageActions.navigateTo(page, url);
  }
}

export async function pingAgent(){
  const plan = await aiAgent.ping();
  return plan;
}


// Helper function to execute AI agent with retry logic
async function executeAgentWithRetry(currentStep, maxFailures) {
  const page = await browserManager.getPage();
  let failures = 0;
  while (failures < maxFailures) {
    try {
      const snapshot = await PageActions.getCleanedHTML(page)||'';
      console.log("failures ---------",failures,snapshot);
      const executePlan = await executePlanPrompt(currentStep, snapshot.trim());
      const executePlanResponse = await aiAgent.callAgent(executePlan);

      if (executePlanResponse?.response_status === "success") {
        return executePlanResponse;
      }
      if(executePlanResponse?.playwright && Array.isArray(executePlanResponse?.playwright)&&executePlanResponse?.playwright.length>0){
        for(const action of executePlanResponse?.playwright){
          await executePlaywrightAction(page, action);
        }
        continue;
      }

      failures++;
      if (failures < maxFailures) {
        const page = await browserManager.getPage();
        await PageActions.scrollDown(page, 500);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      failures++;
      console.log(error)
      if (failures < maxFailures) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  
  return null;
}

// Helper function to execute Playwright actions
async function executePlaywrightAction(page, action) {
  const { type, selector, value } = action;
  
  switch(type) {
    case 'click':
      await PageActions.click(page, selector);
      break;
    case 'fill':
      await PageActions.type(page, selector, value);
      break;
    case 'navigate':
      await PageActions.navigateTo(page, value);
      break;
    case 'wait':
      await PageActions.waitForElement(page, selector);
      break;
    case 'press':
      await PageActions.press(page, selector, value);
      break;
    case 'scrollToElement':
      await PageActions.scrollToElement(page, selector);
      break;
    case 'scroll':
      await PageActions.scrollDown(page, value);
      break;
    case 'extract':
      // Handle extract action if needed
      break;
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

// Helper function to handle step execution
async function executeStep(currentStep, maxFailures) {
  const page = await browserManager.getPage();
  
  const executePlanResponse = await executeAgentWithRetry(currentStep, maxFailures);
  
  if (executePlanResponse?.allStepsCompleted) {
    await browserManager.closeContext();
    return { shouldContinue: false, allStepsCompleted: true };
  }
  
  if (executePlanResponse?.playwright) {
    try {
      await executePlaywrightAction(page, executePlanResponse.playwright);
    } catch (error) {
      console.log(`Action failed: ${error.message}`);
      return { shouldContinue: false, allStepsCompleted: false };
    }
  }
  
  return { shouldContinue: true, allStepsCompleted: false };
}

export async function planAndExecute(userPrompt){
  const plan = demoPlan;
  let currentStepIndex = 0;
  const maxFailures = 5;
  
  while (currentStepIndex < plan.steps.length) {
    const currentStep = plan.steps[currentStepIndex];
    console.log(currentStep)
    const result = await executeStep(currentStep, maxFailures);
    
    if (!result.shouldContinue) {
      return plan;
    }
    
    currentStepIndex++;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return plan;
}