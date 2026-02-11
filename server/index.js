import express from "express";
import knex from "knex";

const app = express();
app.use(express.json());

app.use(express.static("../app"));

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
