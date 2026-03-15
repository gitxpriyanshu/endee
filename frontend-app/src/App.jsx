import { useState } from "react";

function App() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState("");

  const handleSearch = async () => {
    try {
      const res = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      setResults(data.results || []);
      setAnswer(data.answer || "");

    } catch (err) {
      console.error("Search failed:", err);
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>AI Semantic Search</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "400px", padding: "10px" }}
      />

      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: "30px" }}>
        {results.map((r, i) => (
          <p key={i}>
            {r.note} (score: {r.score.toFixed(2)})
          </p>
        ))}
      </div>

      {answer && (
        <div style={{ marginTop: "40px" }}>
          <h3>AI Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
