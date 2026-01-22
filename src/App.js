import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [file, setFile] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnapshots(res.data.snapshots);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-gradient">
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="/">
            <img
              src="/logo.jpg"
              alt="Sanchaalan Logo"
              style={{ width: "40px", marginRight: "10px", borderRadius: "8px" }}
            />
            Sanchaalan
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-5 bg-light">
        <h1 className="fw-bold text-dark">📑 Document Summariser</h1>
        <p className="text-muted">
          Upload your file to generate <span className="fw-semibold text-primary">role-based snapshots</span>
        </p>
      </header>

      {/* Upload Section */}
      <div className="container mt-5">
        <form onSubmit={handleUpload} className="card shadow-lg border-0 p-5 text-center rounded-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control form-control-lg mb-3"
            accept=".pdf,.docx,.eml"
          />
          <button className="btn btn-gradient w-100 py-2" disabled={loading}>
            {loading ? "⚙️ Processing..." : "🚀 Upload & Summarise"}
          </button>
        </form>

        {/* Results */}
        {snapshots.length > 0 && (
          <div className="card shadow-lg border-0 p-5 mt-5 rounded-4 glass-card">
            <h3 className="fw-bold text-success">✅ Snapshots Ready</h3>
            <ul className="list-group list-group-flush mt-3">
              {snapshots.map((s, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-semibold">{s.role}</span>
                  <a
                    href={`http://localhost:5000/snapshots/${s.filename}`}
                    className="btn btn-sm btn-outline-success"
                  >
                    ⬇ Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 mt-5 text-muted">
        🚆 Crafted with ❤️ by <span className="fw-bold text-primary">Team Sanchaalan</span>
      </footer>

      {/* Styles */}
      <style>{`
        .bg-gradient {
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: white;
          border: none;
          transition: transform 0.2s;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}

export default App;
