const { pipeline } = require("@xenova/transformers");

let extractor;

async function loadModel() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractor;
}

async function createEmbedding(text) {
  const model = await loadModel();
  const result = await model(text, { pooling: "mean", normalize: true });

  return Array.from(result.data);
}

module.exports = { createEmbedding };
