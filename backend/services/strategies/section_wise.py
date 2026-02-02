from typing import List, Dict

def get_section_prompt(sections: List[Dict], chunks: List[str]) -> List[Dict[str, str]]:
    """
    Generates a prompt for section-wise summarization.
    Adapts the inputs to a chat message format for the LLM.
    """
    # Combine chunks or sections into a representation
    # Assuming 'sections' contains metadata like {'title': '...', 'page': ...}
    
    document_text = "\n\n".join(chunks)
    
    system_prompt = """You are an expert document analyst. 
Your task is to provide a structured summary of the document, organized by its logical sections.
For each section you identify (or that is provided), write a concise summary.
Ensure the output is well-formatted and easy to read."""

    user_prompt = f"""Please summarize the following document section by section.
    
Document Content:
{document_text}

Output Format:
## [Section Title]
[Summary of section]
...
"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
