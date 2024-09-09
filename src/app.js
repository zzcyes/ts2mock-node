const express = require("express");
const cors = require("cors");
const multer = require("multer");
const MockDataGenerator = require("./core/MockDataGenerator");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/createMock", (req, res) => {
  const { code } = req.body;

  try {
    const generator = new MockDataGenerator(code);
    const result = generator.buildMockResult();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/createMockFunction", (req, res) => {
  const { code } = req.body;

  try {
    const generator = new MockDataGenerator(code);
    const result = generator.buildMockFuncition();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/createMockByFile", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "没有上传文件" });
  }

  const fileContent = req.file.buffer.toString("utf-8");

  try {
    const generator = new MockDataGenerator(fileContent);
    const result = generator.buildMockResult();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  const healthInfo = {
    status: "正常",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  };
  res.json(healthInfo);
});

app.get("/", (req, res) => {
  res.send(`
     <h1>Welcome to TS to Mock Server!</h1>
    <p>If you see this page, the TS to Mock Server is successfully installed and working.</p>
    <p>Further configuration is required.</p>

    <div class="footer">
        <p><em>Thank you for using TS to Mock Server.</em></p>
    </div>
    `);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
