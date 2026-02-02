from typing import List, Dict

def get_executive_prompt(chunks_text: str) -> List[Dict[str, str]]:
    prompt = f"""You are an expert document analyst. Based on the following document content, 
write a concise executive summary (3-5 sentences max).

The summary must:
- Capture the MAIN purpose or argument of the document
- Highlight the most critical finding or recommendation
- Be written for a senior decision-maker who has no time to read the full document
- Be factually accurate — do NOT fabricate information not present in the text

Document content:
{chunks_text}

Executive Summary:"""
    return [{"role": "user", "content": prompt}]
