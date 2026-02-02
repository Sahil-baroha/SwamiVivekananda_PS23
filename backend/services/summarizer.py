import httpx
import asyncio
from typing import List, Dict, Optional, Tuple, Any
from .strategies.executive import get_executive_prompt
from .strategies.detailed import get_detailed_prompt
from .strategies.bullet_points import get_bullet_prompt
from .strategies.section_wise import get_section_prompt
from config import GEMINI_API_KEY, MODEL_NAME

# Gemini API Endpoint
# Gemini API Endpoint
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"

async def call_llm_async(messages: List[Dict[str, str]], model: str = MODEL_NAME) -> str:
    """
    Calls Google Gemini API via REST.
    Adapts OpenAI-style 'messages' to Gemini's 'contents' format.
    """
    try:
        # Convert OpenAI messages to Gemini format
        # Simple adapter: concatenate system + user for simplicity as Gemini system instructions vary by model version
        
        full_prompt = ""
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            if role == "system":
                full_prompt += f"System Instruction: {content}\n\n"
            elif role == "user":
                full_prompt += f"User: {content}\n\n"
        
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GEMINI_URL, 
                json=payload, 
                headers={"Content-Type": "application/json"},
                timeout=60.0
            )
            
            if response.status_code != 200:
                error_detail = response.text
                raise RuntimeError(f"Gemini API Error {response.status_code}: {error_detail}")
            
            data = response.json()
            # Extract text from Gemini response
            try:
                # Structure: candidates[0].content.parts[0].text
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError, TypeError):
                # Handle cases where response structure differs or is empty
                if "candidates" in data and not data["candidates"]:
                     return "Error: Gemini returned no candidates (blocked content?)"
                return f"Error parsing Gemini response: {str(data)}"

    except Exception as e:
        print(f"LLM Call Failed: {e}")
        raise RuntimeError(f"LLM API call failed: {str(e)}")


async def summarize_async(mode: str, chunks: List[str], sections: List[Dict] = None, query: str = None) -> str:
    """
    Async summarization router.
    Takes the mode selected by the user and dispatches to the correct strategy.
    """
    try:
        if mode == "executive":
            prompt_messages = get_executive_prompt(chunks)
            return await call_llm_async(prompt_messages)
        
        elif mode == "detailed":
            prompt_messages = get_detailed_prompt(chunks)
            return await call_llm_async(prompt_messages)
            
        elif mode == "bullet_points":
            prompt_messages = get_bullet_prompt(chunks)
            return await call_llm_async(prompt_messages)
            
        elif mode == "section_wise":
            if not sections:
                raise ValueError("Section-wise mode requires 'sections' metadata.")
            prompt_messages = get_section_prompt(sections, chunks)
            return await call_llm_async(prompt_messages)
        
        elif mode == "query_focused":
            # For query focused, we construct a specific prompt
            combined_text = "\n\n".join(chunks)
            messages = [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": f"Answer the following query based on the document text:\n\nQuery: {query}\n\nDocument Text:\n{combined_text}"}
            ]
            return await call_llm_async(messages)
            
        else:
            raise ValueError(f"Unknown summarization mode: {mode}")

    except Exception as e:
        raise RuntimeError(f"Summarization failed: {str(e)}")


async def hierarchical_summarize_async(chunks: List[str], mode: str, sections: List[Dict] = None, query: str = None) -> str:
    """
    Enhanced ASYNC hierarchical summarization with concurrent processing.
    """
    # Chunk summarization logic
    chunk_summaries = [None] * len(chunks)
    failed_chunks = []

    # Step 1: Define async chunk processor
    async def process_chunk(chunk: str, index: int) -> Tuple[int, str]:
        prompt = f"Summarize the following text segment in 2-3 sentences. Be concise.\n\nText:\n{chunk}"
        messages = [{"role": "user", "content": prompt}]
        
        try:
            summary = await call_llm_async(messages)
            return index, summary
        except Exception as e:
            print(f"Chunk {index} failed: {e}")
            return index, None

    # Step 2: Run all chunks in parallel
    tasks = [process_chunk(chunk, i) for i, chunk in enumerate(chunks)]
    results = await asyncio.gather(*tasks)

    # Step 3: Collect results
    for index, summary in results:
        if summary:
            chunk_summaries[index] = summary
        else:
            failed_chunks.append(index)
    
    # Filter out None values
    valid_summaries = [s for s in chunk_summaries if s]
    
    if not valid_summaries:
        raise RuntimeError("All chunks failed to summarize.")

    # Step 4: Final combination
    combined_summary_text = "\n\n".join(valid_summaries)
    
    # Recursive check omitted for brevity in this fix, assumed standard call_llm_async handles the final pass
    # Using the router to handle the final pass with the correct mode
    return await summarize_async(mode, [combined_summary_text], sections, query)
