from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Union, Any
import uuid
from services.pdf_parser import extract_text_from_pdf_async
from services.preprocessor import clean_text, detect_structure
from services.chunker import chunk_document, get_token_count
from services.summarizer import summarize_async, hierarchical_summarize_async, call_llm_async
from services.coherence import check_coherence
import asyncio

app = FastAPI(title="Smart Document Summarizer API")

# Allow frontend (running on different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Keep static allow list for predictable external URLs
    allow_origin_regex=r"http://localhost:\d+", # Allow any local development server port
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Data Models ─────────────────────────────────────────
class SummarizeRequest(BaseModel):
    mode: str                    # "executive", "detailed", "bullet_points", "section_wise", "query_focused"
    query: Optional[str] = None     # Only used for query_focused mode


# ─── Session-based storage for concurrent users ─────────
# Each session ID maps to its own document data
# This allows multiple users to upload/summarize simultaneously
document_sessions = {}  # {session_id: document_data}

# File size limit (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


# ─── ROUTE 1: Upload & Preprocess ────────────────────────
@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    x_session_id: Optional[str] = Header(None)
):
    """
    Receives a PDF or TXT file with session management.
    Extracts text, cleans it, detects structure, chunks it.
    Stores in session-specific storage for concurrent user support.
    Returns session ID and metadata.
    """
    # Validate file size first
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate or use existing session ID
    session_id = x_session_id or str(uuid.uuid4())
    filename = file.filename

    # Handle PDF vs plain text
    if filename.endswith(".pdf"):
        parsed = await extract_text_from_pdf_async(file_bytes)
        raw_text = parsed["full_text"]
        metadata = parsed["metadata"]
    elif filename.endswith(".txt"):
        raw_text = file_bytes.decode("utf-8")
        metadata = {"title": filename, "author": "Unknown", "page_count": 1}
    else:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")

    # Clean the text
    cleaned_text = clean_text(raw_text)

    # Detect document structure (sections/headings)
    structure = detect_structure(cleaned_text)

    # Chunk the document
    chunks = chunk_document(cleaned_text)

    # Store in session-specific slot
    document_sessions[session_id] = {
        "metadata": metadata,
        "cleaned_text": cleaned_text,
        "structure": structure,
        "chunks": chunks,
        "token_count": get_token_count(cleaned_text),
    }

    # Return session ID and info to the frontend
    return {
        "status": "success",
        "session_id": session_id,  # Frontend must save this
        "metadata": metadata,
        "token_count": document_sessions[session_id]["token_count"],
        "chunk_count": len(chunks),
        "section_count": structure["section_count"],
        "preview": cleaned_text[:500] + "..." if len(cleaned_text) > 500 else cleaned_text,
    }


# ─── ROUTE 2: Generate Summary ───────────────────────────
@app.post("/summarize")
async def generate_summary(
    request: SummarizeRequest,
    x_session_id: str = Header(...)
):
    """
    Generates summary using session-validated document data.
    Requires session ID from upload response.
    """
    # Validate session exists
    if x_session_id not in document_sessions:
        raise HTTPException(
            status_code=404, 
            detail="Session not found. Please upload a document first."
        )
    
    current_doc = document_sessions[x_session_id]
    mode = request.mode
    query = request.query
    chunks = current_doc["chunks"]
    sections = current_doc["structure"]["sections"]

    # If document is long (more than 5 chunks), use hierarchical summarization
    use_hierarchical = len(chunks) > 5

    try:
        if use_hierarchical and mode != "section_wise":
            result = await hierarchical_summarize_async(chunks, mode, sections=sections, query=query)
        else:
            result = await summarize_async(mode, chunks, sections=sections, query=query)

        # Run coherence check if we have multiple chunks
        coherence_info = None
        if len(chunks) > 1 and mode != "section_wise":
            # FIXED: Generate mini-summaries for coherence checking (grounding)
            # We must await these calls
            chunk_summaries = []
            
            # Analyze first 5 chunks for coherence (optimize performance)
            check_chunks = chunks[:5] 
            
            # Concurrent summary generation for coherence
            async def summarize_chunk(chunk):
                try:
                    return await call_llm_async(f"Summarize in 1 sentence: {chunk[:500]}")
                except:
                    return chunk[:200]
            
            # Run concurrently
            check_tasks = [summarize_chunk(c) for c in check_chunks]
            chunk_summaries = await asyncio.gather(*check_tasks)

            # Check coherence of SUMMARIES
            coherence_info = check_coherence(chunk_summaries)

        return {
            "status": "success",
            "mode": mode,
            "summary": result,
            "coherence": coherence_info,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── ROUTE 3: Health Check ───────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}
