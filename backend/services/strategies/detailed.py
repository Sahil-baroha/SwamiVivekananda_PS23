from typing import List, Dict

def get_detailed_prompt(chunks_text: str) -> List[Dict[str, str]]:
    prompt = f"""You are an expert document analyst. Based on the following document content, 
write a comprehensive detailed summary.

The summary must:
- Cover ALL major points and arguments in the document
- Maintain the logical flow of the original document
- Include key data points, statistics, or evidence mentioned
- Be 2-4 paragraphs long
- Be factually accurate — do NOT fabricate information not present in the text

Document content:
{chunks_text}

Detailed Summary:"""
    return [{"role": "user", "content": prompt}]
