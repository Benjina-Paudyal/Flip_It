
import express from "express";
import knex from "knex";


const app = express();
app.use(express.json()); 

app.use(express.static("../app"));


const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true, 
});


app.get("/cards",async (request, response) =>{
  try {
    const cards = await db("cards").select("*");
    response.json(cards);
  } catch (error) {
    response.status(500).json({ error: "Could not load cards"});
  }
});

app.listen(3000, () => {
  console.log("App running on http://localhost:3000. Type Ctrl+C to stop.");
});
