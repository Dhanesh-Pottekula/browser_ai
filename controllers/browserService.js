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
  await PageActions.navigateTo(page, url);
}

export async function pingAgent(){
  const plan = await aiAgent.ping();
  return plan;
}

export async function planAndExecute(userPrompt){
  // const plan = await aiAgent.plan(userPrompt);
  const plan = demoPlan;

  let currentStepIndex = 0;

  // while (currentStepIndex < plan.steps.length) {
    const currentStep = plan.steps[currentStepIndex];
    
    // Get current page snapshot for this step
    const page = await browserManager.getPage();
    const snapshot = await PageActions.getCleanedHTML(page);
    const domElements = snapshot;
    
    console.log(domElements);
    // // Generate execution prompt for current step
    // const executePlan = await executePlanPrompt(plan, currentStep, domElements);
    // const executePlanResponse = await aiAgent.callAgent(executePlan);
    
    // // Check if agent should stop (due to failure or completion)
    // if(executePlanResponse?.stopAgent){
    //   console.log(`Agent stopped at step ${currentStepIndex + 1}: ${currentStep.title}`);
    //   return plan;
    // }
    
    // // Check if all steps are completed
    // if(executePlanResponse?.allStepsCompleted){
    //   console.log(`All steps completed successfully`);
    //   await browserManager.closeContext();
    //   return plan;
    // }
    
    // // Execute the Playwright action if provided
    // if(executePlanResponse?.playwright) {
    //   const page = await browserManager.getPage();
    //   const { type, selector, value } = executePlanResponse.playwright;
      
    //   try {
    //     switch(type) {
    //       case 'click':
    //         await PageActions.click(page, selector);
    //         break;
    //       case 'fill':
    //         await PageActions.type(page, selector, value);
    //         break;
    //       case 'navigate':
    //         await PageActions.navigateTo(page, value);
    //         break;
    //       case 'wait':
    //         await PageActions.waitForElement(page, selector);
    //         break;
    //       case 'press':
    //         await PageActions.press(page, selector, value);
    //         break;
    //       case 'extract':
    //         // Handle data extraction if needed
    //         console.log(`Extracting data from: ${selector}`);
    //         break;
    //       default:
    //         console.log(`Unknown action type: ${type}`);
    //     }
    //   } catch (error) {
    //     console.error(`Error executing ${type} action:`, error);
    //   }
    // }
    
    // // Check if there's a nextStepId to jump to
    // if(executePlanResponse?.nextStepId) {
    //   // Find the step with the specified ID
    //   const nextStepIndex = plan.steps.findIndex(step => step.id === executePlanResponse.nextStepId);
    //   if(nextStepIndex !== -1) {
    //     console.log(`Jumping to step ${nextStepIndex + 1}: ${plan.steps[nextStepIndex].title}`);
    //     currentStepIndex = nextStepIndex;
    //   } else {
    //     console.log(`Step ID ${executePlanResponse.nextStepId} not found, continuing to next step`);
    //     currentStepIndex++;
    //   }
    // } else {
    //   // Continue to next step in sequence
    //   currentStepIndex++;
    // }
    
    // // Log step completion
    // console.log(`Step ${currentStepIndex} processed: ${currentStep.title}`);
    
    // Add a small delay between steps to allow for page updates
    await new Promise(resolve => setTimeout(resolve, 2000));
  // }
  
  return plan;
}