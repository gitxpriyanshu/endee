const { pipeline } = require("@xenova/transformers");

let generator;

async function generateAnswer(context, query) {

    if (!generator) {
        generator = await pipeline("text-generation", "Xenova/distilgpt2");
    }

    const prompt = `
Context: ${context}

Question: ${query}

Answer:
`;

    const result = await generator(prompt, {
        max_new_tokens: 30
    });

    const text = result[0].generated_text;

    const cleaned = text.split("Answer:").pop().trim();

    return cleaned;
}

module.exports = { generateAnswer };
