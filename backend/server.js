const express = require("express");
const cors = require("cors");
const { semanticSearch } = require("./search");
const { generateAnswer } = require("./generate");

const app = express();

app.use(cors());
app.use(express.json());

let notes = [];

app.get("/", (req, res) => {
    res.send("AI Semantic Search API Running");
});

app.post("/add-note", (req, res) => {
    const { text } = req.body;

    notes.push(text);

    res.json({
        message: "Note added",
        totalNotes: notes.length
    });
});

app.post("/search", async (req, res) => {

    const { query } = req.body;

    const results = await semanticSearch(query, notes);

    const context = results.map(r => r.note).join(" ");

    const answer = await generateAnswer(context, query);

    res.json({
        results,
        answer
    });

});


app.listen(3001, () => {
    console.log("Server running on port 3001");
});

