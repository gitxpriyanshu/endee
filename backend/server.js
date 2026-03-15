const express = require("express");
const cors = require("cors");
const { semanticSearch } = require("./search");
const { generateAnswer } = require("./generate");
const { initDB } = require("./db");
const { createEmbedding } = require("./vector");

const app = express();

app.use(cors());
app.use(express.json());

let indexDb = null;
let totalNotesCount = 0;

// Initialize Endee on startup
initDB().then(idx => {
    indexDb = idx;
    console.log("Endee DB fully initialized and ready.");
}).catch(err => {
    console.error("Failed to initialize Endee DB", err);
});

app.get("/", (req, res) => {
    res.send("AI Semantic Search API Running with Endee Vector Database");
});

app.post("/add-note", async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!indexDb) {
            return res.status(500).json({ error: "DB not initialized yet. Make sure Endee server is running on localhost:8080." });
        }

        const embedding = await createEmbedding(text);
        
        const id = Date.now().toString() + "_" + Math.floor(Math.random() * 1000);

        await indexDb.upsert([{
            id: id,
            vector: embedding,
            meta: { text: text }
        }]);

        totalNotesCount++;

        res.json({
            message: "Note successfully added to Endee vector database",
            totalNotes: totalNotesCount
        });
    } catch (err) {
        console.error("Error inserting into Endee:", err);
        res.status(500).json({ error: "Failed to add note to Endee" });
    }
});

app.post("/search", async (req, res) => {
    try {
        const { query } = req.body;

        if (!indexDb) {
            return res.status(500).json({ error: "DB not initialized yet. Make sure Endee server is running." });
        }

        const results = await semanticSearch(indexDb, query);

        const context = results.map(r => r.note).join(" ||| ");
        const answer = await generateAnswer(context, query);

        res.json({
            results,
            answer
        });
    } catch (err) {
        console.error("Error querying Endee:", err);
        res.status(500).json({ error: "Failed to search using Endee" });
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
