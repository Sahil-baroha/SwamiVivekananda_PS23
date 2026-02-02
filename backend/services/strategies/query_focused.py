def get_query_focused_prompt(chunks_text: str, query: str) -> str:
    return f"""You are an expert document analyst. Based on the following document content, 
answer the user's specific question with a focused summary.

User's Question: {query}

Requirements:
- Answer the question DIRECTLY using information from the document
- If the document does not contain relevant information to answer the question, 
  explicitly state: "The document does not contain sufficient information to answer this question."
- Be factually accurate — do NOT fabricate information not present in the text
- Keep the answer to 2-4 sentences unless more detail is needed

Document content:
{chunks_text}

Answer:"""
