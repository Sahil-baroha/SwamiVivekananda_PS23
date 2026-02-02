const BASE_URL = "http://localhost:8000";

/**
 * Upload a document (PDF or TXT) to the backend
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Response containing metadata and preview
 */
export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
    }

    return response.json();
}

/**
 * Generate a summary using the selected mode
 * @param {string} mode - Summarization mode
 * @param {string} query - Optional query for query-focused mode
 * @returns {Promise<Object>} Summary result
 */
export async function generateSummary(mode, query = null) {
    const response = await fetch(`${BASE_URL}/summarize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, query }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Summarization failed");
    }

    return response.json();
}

/**
 * Check backend health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
    const response = await fetch(`${BASE_URL}/health`);
    return response.json();
}
