# ⚖️ Legal Assistant AI

A sophisticated, AI-powered legal research and drafting assistant built with **FastAPI**, **React**, and **Google Gemini 1.5**. This application leverages Retrieval-Augmented Generation (RAG) to provide citations from Indian Supreme Court precedents.

## ✨ Features

- **🔍 Intelligent Research**: Context-aware Q&A based on Indian legal datasets (e.g., *Puttaswamy* judgment).
- **📝 Drafting Hub**: Professional templates for Case Summaries, Petitions, and Legal Notices.
- **📚 Source Citations**: Every AI response includes direct citations to the retrieved legal documents.
- **💎 Premium UI**: A modern, glassmorphic dashboard with smooth animations and responsive design.
- **🛡️ Secure Connectivity**: Robust Gemini 1.5 integration with multi-model fallback.

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python), ChromaDB (Vector Store), FastEmbed (Embeddings), Google Generative AI (Gemini).
- **Frontend**: React (Vite), Lucide-React (Icons), Tailwind-inspired CSS (Custom Design System).

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- Node.js & npm
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Create .env and add GOOGLE_API_KEY=your_key
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

The project includes a comprehensive backend testing suite:
```bash
cd backend
pytest
```

---
*Created with ❤️ for Legal Professionals.*
