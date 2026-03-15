async function generateAnswer(context, query) {
    // For small demo purposes, trying to run a full LLM in Node.js 
    // with @xenova/transformers (which is a tiny 80MB distilgpt2 model)
    // often leads to severe hallucinations because it's just a text-completer.
    
    // Instead, to ensure a 100% reliable and professional demo for recruiters,
    // we use an "extractive" approach. The AI (Vector DB) has already done the
    // hard work of finding the semantically most similar sentence. We just present it cleanly.

    if (!context || context.trim() === "") {
        return "I couldn't find any relevant information in the database to answer your question.";
    }

    // Since server.js joins results with " ||| ", we can accurately split them back
    // and just present the top (first) one as the extracted answer.
    const exactFact = context.split(" ||| ")[0];

    return `Based on your semantic search, the most relevant information is: "${exactFact.trim()}"`;
}

module.exports = { generateAnswer };
