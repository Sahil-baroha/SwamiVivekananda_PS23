from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken

def get_token_count(text: str) -> int:
    """Counts tokens using OpenAI's tokenizer for accuracy."""
    encoder = tiktoken.get_encoding("cl100k_base")  # Used by GPT-4 models
    return len(encoder.encode(text))


def chunk_document(text: str, chunk_size: int = 2000, chunk_overlap: int = 200) -> list[str]:
    """
    Splits text into chunks using recursive character splitting.

    chunk_size: Max tokens per chunk (2000 is safe for GPT-4o-mini)
    chunk_overlap: How many tokens overlap between consecutive chunks
                   (prevents losing context at boundaries)

    RecursiveCharacterTextSplitter tries to split on, in order:
    1. Double newlines (paragraph breaks) — best semantic boundary
    2. Single newlines
    3. Periods (sentence boundaries)
    4. Spaces (word boundaries) — last resort

    This means it ALWAYS tries to preserve meaning before resorting to hard cuts.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=get_token_count,  # Measure by TOKENS, not characters
        separators=["\n\n", "\n", ". ", " "],
    )

    chunks = splitter.split_text(text)
    return chunks
