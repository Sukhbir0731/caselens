# CaseLens

CaseLens is a full-stack application for managing legal and medical case documents.

It allows professionals to upload PDFs, automatically extracts and summarizes them using AI, and presents a structured case summary with a timeline of events.

---

## ✨ Features

- **Case Management**

  - Create new cases or add documents to existing ones
  - Rename cases inline (with automatic conflict handling, e.g. `CaseName(1)`)
  - Delete cases with confirmation dialog

- **Document Upload & Processing**

  - Drag-and-drop or file picker for PDFs
  - Duplicate detection to avoid reprocessing the same document
  - AI-powered summarization of each document
  - Case-level summary generated from all included documents

- **Timeline View**

  - Documents grouped by date
  - Displays provider, doc type, filename, and AI highlight
  - Print-friendly view with “Print Timeline” button

- **Frontend**

  - Built with **React + Vite + TypeScript**
  - State management via **React Query**
  - Styling with **TailwindCSS**
  - Inline editing for renaming cases

- **Backend**
  - Built with **FastAPI** (Python)
  - Uses **SQLite** for metadata storage
  - PDF text extraction (OCR support)
  - Background tasks for AI calls
  - API endpoints for case CRUD, uploads, and JSON export

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (>= 18.x recommended)
- [Python](https://www.python.org/) (>= 3.11)
- [Ollama](https://ollama.com/) installed locally for LLM calls  
  (or configure backend to use a different provider)
- Git

---

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/caselens.git
cd caselens
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
pip install -r requirements.txt
```

#### Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at http://127.0.0.1:8000

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at http://localhost:5173

---
