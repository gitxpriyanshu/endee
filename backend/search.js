const { createEmbedding } = require("./vector");

async function semanticSearch(indexDb, query) {
    const queryEmbedding = await createEmbedding(query);

    const results = await indexDb.query({
        vector: queryEmbedding,
        topK: 3
    });

    return results.map(r => ({
        note: r.meta?.text || "Unknown Note",
        score: r.similarity || 0
    }));
}

module.exports = { semanticSearch };
