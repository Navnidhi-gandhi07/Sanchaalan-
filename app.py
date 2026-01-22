import os
import json
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

from dotenv import load_dotenv
load_dotenv()

import mvp  # your pipeline module

UPLOAD_FOLDER = "uploads"
SNAPSHOT_FOLDER = "snapshots_out"
ALLOWED_EXTENSIONS = {"pdf", "docx", "eml"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["SNAPSHOT_FOLDER"] = SNAPSHOT_FOLDER

CORS(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SNAPSHOT_FOLDER, exist_ok=True)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No filename"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)  # type: ignore
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Run pipeline: creates snapshots + saves structured json + builds index + tries email
        outputs = mvp.process_file(file_path)  # returns [(role, path_to_docx)]
        results = [{"role": r, "filename": os.path.basename(p)} for r, p in outputs]

        return jsonify({
            "message": "Processed successfully",
            "doc_id": os.path.basename(file_path),
            "snapshots": results
        })

    return jsonify({"error": "Unsupported file type"}), 400


@app.route("/snapshots/<path:filename>")
def get_snapshot(filename):
    return send_from_directory(app.config["SNAPSHOT_FOLDER"], filename, as_attachment=True)


@app.route("/query", methods=["POST"])
def query_docs():
    """
    JSON body:
    {
      "query": "your question",
      "doc_id": "optional filename like test1.pdf"
    }
    """
    data = request.get_json(force=True, silent=False)
    query = (data.get("query") or "").strip()
    doc_id = (data.get("doc_id") or "").strip()

    if not query:
        return jsonify({"error": "query is required"}), 400

    index_dir = os.path.join(app.config["SNAPSHOT_FOLDER"], "index")
    if not os.path.exists(index_dir):
        return jsonify({"error": "No index found. Upload a document first."}), 400

    chunks = []
    if doc_id:
        idx_path = os.path.join(index_dir, f"{os.path.splitext(doc_id)[0]}.chunks.json")
        if not os.path.exists(idx_path):
            return jsonify({"error": f"No index for doc_id={doc_id}. Upload it first."}), 400
        with open(idx_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)
    else:
        # query across all indexed docs
        for fn in os.listdir(index_dir):
            if fn.endswith(".chunks.json"):
                with open(os.path.join(index_dir, fn), "r", encoding="utf-8") as f:
                    chunks.extend(json.load(f))

    result = mvp.answer_query(query, chunks)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
