const { semanticSearch } = require("./search");

async function run() {

  const notes = [
    "React hooks are used in functional components",
    "JavaScript closures allow access to outer scope",
    "Machine learning models learn patterns from data"
  ];

  const query = "Explain React hooks";

  const results = await semanticSearch(query, notes);

  console.log("Query:", query);
  console.log("\nTop Results:\n");

  results.forEach(r => {
    console.log(r.note, "| score:", r.score.toFixed(3));
  });

}

run();
