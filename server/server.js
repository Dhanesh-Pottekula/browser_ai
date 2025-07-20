import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { launchBrowserWithConfig } from "../controllers/browserController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/launch", async (req, res) => {
  try {
    await launchBrowserWithConfig(req.body);
    res.send({ status: "Launched" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
