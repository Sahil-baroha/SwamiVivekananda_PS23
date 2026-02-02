from sentence_transformers import SentenceTransformer
import numpy as np

# Load model once (takes a few seconds on first run, then cached)
model = SentenceTransformer("all-MiniLM-L6-v2")  # Small, fast, accurate model


def get_embeddings(texts: list[str]) -> np.ndarray:
    """Converts a list of text strings into embedding vectors."""
    return model.encode(texts)


def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """Computes cosine similarity between two vectors. Range: -1 to 1."""
    return float(np.dot(vec_a, vec_b) / (np.linalg.norm(vec_a) * np.linalg.norm(vec_b)))


def check_coherence(chunk_summaries: list[str], threshold: float = 0.3) -> dict:
    """
    Enhanced coherence checking with contradiction detection.
    
    Checks if chunk summaries are coherent with each other.

    Returns:
    - coherence_score: Average pairwise similarity (higher = more coherent)
    - is_coherent: Boolean — True if above threshold
    - redundant_pairs: List of summary pairs that are too similar (>0.85)
    - contradictory_pairs: List of adjacent summary pairs that are too different (<0.15)
    - flagged: True if any issues detected
    """
    if len(chunk_summaries) < 2:
        return {"coherence_score": 1.0, "is_coherent": True, "redundant_pairs": [], "contradictory_pairs": [], "flagged": False}

    embeddings = get_embeddings(chunk_summaries)

    similarities = []
    redundant_pairs = []
    contradictory_pairs = []  # NEW: Detect contradictions

    for i in range(len(embeddings)):
        for j in range(i + 1, len(embeddings)):
            sim = cosine_similarity(embeddings[i], embeddings[j])
            similarities.append(sim)

            # Flag pairs that are nearly identical (redundant)
            if sim > 0.85:
                redundant_pairs.append((i, j, round(sim, 3)))
            
            # NEW: Contradiction detection - adjacent chunks should relate
            if abs(i - j) == 1 and sim < 0.15:  # Adjacent chunks
                contradictory_pairs.append((i, j, round(sim, 3)))

    avg_similarity = float(np.mean(similarities))

    return {
        "coherence_score": round(avg_similarity, 3),
        "is_coherent": avg_similarity >= threshold,
        "redundant_pairs": redundant_pairs,
        "contradictory_pairs": contradictory_pairs,  # NEW
        "flagged": len(redundant_pairs) > 0 or len(contradictory_pairs) > 0,
        "analysis": {
            "redundant_count": len(redundant_pairs),
            "contradiction_count": len(contradictory_pairs),
        }
    }
