const { createEmbedding } = require("./vector");

function cosineSimilarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return dot / (magA * magB);
}

async function semanticSearch(query, notes) {

    const queryEmbedding = await createEmbedding(query);

    const results = [];

    for (let note of notes) {

        const embedding = await createEmbedding(note);

        const score = cosineSimilarity(queryEmbedding, embedding);

        results.push({ note, score });

    }

    // sort by best similarity
    results.sort((a, b) => b.score - a.score);

    // remove duplicate notes
    const uniqueResults = [];
    const seen = new Set();

    for (let r of results) {
        if (!seen.has(r.note)) {
            uniqueResults.push(r);
            seen.add(r.note);
        }
    }

    // return only top 3
    return uniqueResults.slice(0, 3);
}

module.exports = { semanticSearch };
