const express = require("express");
const path = require("path");
const { launchBrowserWithConfig } = require("../controllers/browserController");

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
