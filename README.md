# Sanchaalan-
Document processing + role-based snapshots + query Q&amp;A


Sanchaalan — Intelligent Document Processing & Q&A System

Sanchaalan is an end-to-end document intelligence system that performs automated document ingestion, role-based summarization, email delivery, and interactive question answering. The system is designed to process real-world documents such as PDFs, DOCX files, and emails, extract meaningful structured information, generate stakeholder-specific insights, and allow users to query documents interactively.

What the Project Does

Sanchaalan provides two core capabilities:

Automatic Document Processing & Delivery

Upload a document once

Extract text, tables, and images (with OCR for scanned PDFs)

Generate role-specific summaries for Engineering, Finance, Safety, HR, and Management

Export each summary as a DOCX snapshot

Automatically send snapshots to stakeholders via email (SMTP)

Interactive Question Answering

Ask natural language questions over uploaded documents

Answers are generated strictly from document content

Uses indexed document chunks for retrieval

No emails are triggered during queries

Key Features

Supports PDF, DOCX, and EML files

OCR support for scanned documents using Tesseract

Table extraction and image captioning

Role-based summarization using transformer models

SMTP-based email delivery

Query API for document-grounded Q&A

Structured JSON and chunk indexing for traceability

High-Level Architecture

Upload → Extraction (Text / Tables / Images / OCR) →
Structured JSON + Chunk Index →
Role-Based Snapshots (DOCX + Email) AND Query Engine (Q&A API)

Project Structure

Sanchaalan
├── app.py (Flask API: upload & query endpoints)
├── mvp.py (Core processing pipeline)
├── smtp.py (SMTP email utility)
├── README.md (Documentation)
├── .gitignore (Git ignore rules)
├── uploads/ (Uploaded documents)
├── snapshots_out/
│ ├── assets/ (Extracted images)
│ ├── structured/ (Structured JSON output)
│ ├── index/ (Chunk index for Q&A)
│ └── *.docx (Role-based snapshots)

Setup Instructions (Windows)
Step 1: Clone the Repository

git clone https://github.com/Navnidhi-gandhi07/Sanchaalan-.git

cd Sanchaalan-

Step 2: Create and Activate Virtual Environment (Recommended)

python -m venv .venv
.venv\Scripts\activate

Step 3: Install Dependencies

pip install flask flask-cors werkzeug python-dotenv
pip install pymupdf pdfplumber pillow pytesseract langdetect
pip install transformers torch python-docx

Optional (for better table extraction):
pip install camelot-py[cv]

Step 4: Install Tesseract OCR

Download from: https://github.com/UB-Mannheim/tesseract/wiki

Install with default settings

Add the following path to system PATH:
C:\Program Files\Tesseract-OCR\

Verify installation:
tesseract --version

If PATH does not work, add this line in mvp.py after importing pytesseract:

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

Step 5: Download Summarization Model (One-Time)

python -c "from transformers import pipeline; pipeline('summarization', model='sshleifer/distilbart-cnn-12-6')"

This downloads and caches the model locally.

Step 6: Configure Email (SMTP)

Create a .env file in the project root:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com

SMTP_PASS=your_16_digit_gmail_app_password
SMTP_FROM=yourgmail@gmail.com

Use a Gmail App Password (not your normal Gmail password).

Running the Application

python app.py

The server will start at:
http://127.0.0.1:5000

Uploading a Document

Use Command Prompt (recommended on Windows):

curl -X POST http://127.0.0.1:5000/upload
 -F "file=@test1.pdf"

On upload:

Role-based snapshots are generated

Emails are sent to configured stakeholders

Query index is built automatically

Asking Questions (Query API)

Use Command Prompt:

curl -X POST http://127.0.0.1:5000/query
 -H "Content-Type: application/json" -d "{"query":"What are the key points?","doc_id":"test1.pdf"}"
