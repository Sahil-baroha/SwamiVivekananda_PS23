# DrishtiAI - Smart Document Summarizer

A full-stack AI-powered document summarization application with multiple summarization strategies.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key or Groq API Key

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file:
```
OPENAI_API_KEY=your-key-here
# OR
GROQ_API_KEY=your-key-here
```

Run the backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📚 Features

- **Multiple Summarization Modes:**
  - Executive Summary (3-5 sentences)
  - Detailed Summary (2-4 paragraphs)
  - Bullet Points (5-10 key takeaways)
  - Section-wise (per section analysis)
  - Query-Focused (answer specific questions)

- **Advanced Processing:**
  - PyMuPDF for PDF extraction
  - LangChain for intelligent chunking
  - Sentence Transformers for coherence checking
  - GPT-4o-mini / Groq Llama integration

- **Modern UI:**
  - Cyberpunk-inspired design system
  - Drag-and-drop file upload
  - Real-time processing feedback
  - Responsive design

## 🏗️ Tech Stack

**Backend:** FastAPI, Python, OpenAI API, LangChain, PyMuPDF, Sentence Transformers

**Frontend:** React, Vite, Tailwind CSS, Lucide Icons

## 📝 API Endpoints

- `POST /upload` - Upload and process document
- `POST /summarize` - Generate summary
- `GET /health` - Health check

## 🎨 Design Philosophy

Following the frontend-design skill guidelines, this application features:
- Distinctive Orbitron + JetBrains Mono typography
- Neon cyberpunk color palette
- Animated gradients and glow effects
- Smooth transitions and micro-interactions

## License

MIT
