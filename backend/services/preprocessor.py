import re

def clean_text(text: str) -> str:
    """
    Cleans raw extracted text:
    - Removes extra whitespace and newlines
    - Removes common PDF artifacts (page numbers, headers/footers patterns)
    - Normalizes unicode characters
    """
    # Normalize unicode (e.g., curly quotes → straight quotes)
    text = text.encode("ascii", "ignore").decode("ascii")

    # Remove lines that are just page numbers (common PDF artifact)
    text = re.sub(r"^\s*\d+\s*$", "", text, flags=re.MULTILINE)

    # Collapse multiple newlines into double newline (paragraph break)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse multiple spaces into one
    text = re.sub(r" {2,}", " ", text)

    # Strip leading/trailing whitespace
    text = text.strip()

    return text


def detect_structure(text: str) -> dict:
    """
    Detects basic document structure.
    Looks for headings (ALL CAPS lines, or lines followed by dashes).
    Returns a list of detected sections.
    """
    lines = text.split("\n")
    sections = []
    current_section = {"heading": "Introduction", "content": ""}

    heading_pattern = re.compile(r"^[A-Z][A-Z\s]{2,}$")  # Detects ALL CAPS headings

    for line in lines:
        stripped = line.strip()
        if not stripped:
            current_section["content"] += "\n"
            continue

        # If line looks like a heading
        if heading_pattern.match(stripped) and len(stripped) > 3:
            # Save current section if it has content
            if current_section["content"].strip():
                sections.append(current_section)
            # Start new section
            current_section = {"heading": stripped.title(), "content": ""}
        else:
            current_section["content"] += stripped + "\n"

    # Don't forget the last section
    if current_section["content"].strip():
        sections.append(current_section)

    return {"sections": sections, "section_count": len(sections)}
