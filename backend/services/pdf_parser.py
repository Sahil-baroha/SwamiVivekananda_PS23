import fitz  # PyMuPDF
import asyncio

def _extract_text_sync(file_bytes: bytes) -> dict:
    """
    Synchronous extraction logic (internal).
    Takes raw PDF bytes, returns extracted text + metadata.
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    metadata = {
        "title": doc.metadata.get("title", "Untitled"),
        "author": doc.metadata.get("author", "Unknown"),
        "page_count": doc.page_count,
    }

    full_text = ""
    pages = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text()  # Extracts all text from this page
        pages.append({"page_number": page_num + 1, "text": page_text})
        full_text += page_text + "\n"

    doc.close()

    return {
        "metadata": metadata,
        "full_text": full_text.strip(),
        "pages": pages,
    }


async def extract_text_from_pdf_async(file_bytes: bytes) -> dict:
    """
    Async wrapper for PDF text extraction.
    Offloads the blocking PyMuPDF call to a thread pool.
    """
    loop = asyncio.get_event_loop()
    # Run blocking fitz.open in default executor
    return await loop.run_in_executor(None, _extract_text_sync, file_bytes)
