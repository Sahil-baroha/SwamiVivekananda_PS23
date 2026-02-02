from typing import List, Dict

def get_bullet_prompt(chunks_text: str) -> List[Dict[str, str]]:
    prompt = f"""You are an expert document analyst. Based on the following document content, 
extract the key takeaways as bullet points.

Requirements:
- List 5-10 bullet points
- Each bullet must be a single, clear, actionable or informative statement
- Start each bullet with a dash (-)
- Order bullets by importance (most important first)
- Be factually accurate — do NOT fabricate information not present in the text

Document content:
{chunks_text}

Key Takeaways:"""
    return [{"role": "user", "content": prompt}]
