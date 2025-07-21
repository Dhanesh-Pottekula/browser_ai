import express from 'express';
import AiAgent from '../agents/aiAgentClass.js';
import { launchBrowserWithConfig, pingAgent, planAndExecute } from './browserService.js';

const router = express.Router();
const aiAgent = new AiAgent();

// Route handlers
router.post("/launch", async (req, res) => {
  try {
    await launchBrowserWithConfig(req.body);
    res.send({ status: "Launched" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/ping", async (req, res) => {
  try {
    const response = await pingAgent();
    res.send({ status: "success", response });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/plan_and_execute", async (req, res) => {
  try {
    const response = await planAndExecute(req.body);
    res.send({ status: "success", response });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
export default router;
