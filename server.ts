import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");
const OPTIONS_FILE = path.join(process.cwd(), "options.json");

// Ensure data files exist
async function ensureDataFiles() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    console.log("Creating default data.json");
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
  try {
    await fs.access(OPTIONS_FILE);
  } catch {
    console.log("Creating default options.json");
    await fs.writeFile(OPTIONS_FILE, JSON.stringify([], null, 2));
  }
}

ensureDataFiles();
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure uploads directory exists
try {
  await fs.access(UPLOADS_DIR);
} catch {
  await fs.mkdir(UPLOADS_DIR);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API routes
  app.post("/api/upload", (req, res) => {
    console.log("Upload request received:", req.headers["content-length"], "bytes");
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "파일 용량이 너무 큽니다. (최대 100MB)" });
        }
        return res.status(400).json({ error: `업로드 오류: ${err.message}` });
      } else if (err) {
        console.error("Unknown upload error:", err);
        return res.status(500).json({ error: "업로드 중 알 수 없는 오류가 발생했습니다." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "파일이 선택되지 않았습니다." });
      }

      console.log("File uploaded successfully:", req.file.filename);
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    });
  });

  app.get("/api/wrappers", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      console.log(`Successfully read ${DATA_FILE}`);
      res.json(JSON.parse(data));
    } catch (error) {
      console.error(`Error reading ${DATA_FILE}:`, error);
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/wrappers", async (req, res) => {
    try {
      const newData = req.body;
      await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  app.get("/api/options", async (req, res) => {
    try {
      const data = await fs.readFile(OPTIONS_FILE, "utf-8");
      console.log(`Successfully read ${OPTIONS_FILE}`);
      res.json(JSON.parse(data));
    } catch (error) {
      console.error(`Error reading ${OPTIONS_FILE}:`, error);
      res.status(500).json({ error: "Failed to read options" });
    }
  });

  app.post("/api/options", async (req, res) => {
    try {
      const newData = req.body;
      await fs.writeFile(OPTIONS_FILE, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save options" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  server.timeout = 300000; // 5 minutes
}

startServer();
