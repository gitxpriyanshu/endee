const { pipeline } = require("@xenova/transformers");

let generator;

async function generateAnswer(context, query) {
    if (!generator) {
        generator = await pipeline("text-generation", "Xenova/distilgpt2");
    }

    const prompt = `System: You are an AI answering questions based ONLY on the context. If the answer is not in the context, say so.
Context: ${context}
Question: ${query}
Answer:`;

    const result = await generator(prompt, {
        max_new_tokens: 25,
        temperature: 0.1, // Lower temperature to make it deterministic and stick to context
        repetition_penalty: 1.2
    });

    const text = result[0].generated_text;
    
    // Extract just the answer part
    let cleaned = text.split("Answer:").pop().trim();
    cleaned = cleaned.split("\n")[0].trim();
    
    if (!cleaned || cleaned.toLowerCase().includes("question:") || cleaned.length < 10) {
        // Fallback to purely extractive summary if generation fails
        cleaned = "Based on our data: " + context.substring(0, 100) + "...";
    }

    return cleaned;
}

module.exports = { generateAnswer };
