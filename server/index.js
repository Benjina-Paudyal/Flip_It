import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Build __dirname in ES modules
const __filename = fileURLToPath(import.meta.url); // C:\project\server\index.js
const __dirname = path.dirname(__filename); // C:\project\server

// Serve static frontend
const clientPath = path.join(__dirname, "../app");
app.use(express.static(clientPath));

// Set port
const PORT = process.env.PORT || 3000; // process.env.PORT: for hosting services, 3000: fallback for running locally

// Setup database
const db = knex({
  client: "sqlite3",
  connection: { 
    filename: path.join(__dirname, "database.db") 
  },
  useNullAsDefault: true,
});

// API Routes
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await db("cards").select("*");
    res.json(cards);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Could not load cards" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
