import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addStatus, setAddStatus] = useState("");

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

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddStatus("Adding...");
    try {
      const res = await fetch("http://localhost:3001/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteText }),
      });
      const data = await res.json();
      setAddStatus(data.message || "Note added successfully!");
      setNoteText("");
      setTimeout(() => setAddStatus(""), 3000);
    } catch (err) {
      console.error("Failed to add note:", err);
      setAddStatus("Failed to add note");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>AI Semantic Search</h1>

      <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", display: "inline-block", borderRadius: "10px" }}>
        <h3>Add Data to Database</h3>
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter a new note or fact..."
          style={{ width: "300px", padding: "10px", marginRight: "10px" }}
        />
        <button onClick={handleAddNote} style={{ padding: "10px 20px" }}>Add Note</button>
        {addStatus && <p style={{ color: "green", marginTop: "10px" }}>{addStatus}</p>}
      </div>

      <div>
        <h3>Search Database</h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          style={{ width: "400px", padding: "10px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 20px" }}>Search</button>

        <div style={{ marginTop: "30px", maxWidth: "600px", margin: "30px auto", textAlign: "left" }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: "10px", backgroundColor: "#f9f9f9", marginBottom: "10px", borderRadius: "5px" }}>
              <p style={{ margin: 0 }}>{r.note}</p>
              <small style={{ color: "#888" }}>Similarity Score: {r.score.toFixed(3)}</small>
            </div>
          ))}
        </div>

        {answer && (
          <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#e3f2fd", borderRadius: "10px", display: "inline-block", maxWidth: "600px", textAlign: "left" }}>
            <h3 style={{ marginTop: 0 }}>AI Answer</h3>
            <p style={{ margin: 0 }}>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
