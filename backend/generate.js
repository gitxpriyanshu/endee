const { pipeline } = require("@xenova/transformers");

let generator;

async function generateAnswer(context, query) {
    if (!generator) {
        generator = await pipeline("text-generation", "Xenova/distilgpt2");
    }

    const prompt = `Based on the following context, answer the question clearly and concisely.

Context: ${context}

Question: ${query}

Answer:`;

    const result = await generator(prompt, {
        max_new_tokens: 30,
        temperature: 0.7,
        repetition_penalty: 1.5,
        do_sample: true
    });

    const text = result[0].generated_text;
    
    // Extract just the answer part and stop at the first period or newline
    let cleaned = text.split("Answer:").pop().trim();
    cleaned = cleaned.split("\n")[0].trim();
    
    if (cleaned.length < 5) {
        cleaned = "Based on the context, this information seems related to: " + context.substring(0, 50) + "...";
    }

    return cleaned;
}

module.exports = { generateAnswer };
