import express from "express";
import cors from "cors";
import booksRouter from "./routers/books.router.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "books-ai-search",
    message: "API is running. Use /api/health or /api/books/* endpoints.",
    endpoints: ["/api/health", "/api/books/search?query=atomic%20habits"],
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "books-ai-search",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not Found",
    path: req.originalUrl,
  });
});

app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  res.status(status).json({
    ok: false,
    error: err?.message || "Internal server error",
  });
});

if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`Books API listening on http://localhost:${port}`);
  });
}

export default app;
