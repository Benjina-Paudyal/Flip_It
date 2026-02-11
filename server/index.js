import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// convert the module URL into a normal file path (ES modules)
const __filename = fileURLToPath(import.meta.url);

// get the directory of the server folder
const __dirname = path.dirname(__filename);

// serve frontend files
app.use(express.static(path.join(__dirname, "../app")));

// Set port
const PORT = process.env.PORT || 3000;

// Setup database
const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true,
});

// Routes
app.get("/cards", async (request, response) => {
  try {
    const cards = await db("cards").select("*");
    response.json(cards);
  } catch (error) {
    response.status(500).json({ error: "Could not load cards" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
