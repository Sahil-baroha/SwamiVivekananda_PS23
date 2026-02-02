import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, X } from 'lucide-react';

export default function Upload({ onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState(null);  // NEW: Track session

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.txt'))) {
            setFile(droppedFile);
            setError(null);
        } else {
            setError('Please upload a PDF or TXT file');
        }
    }, []);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const headers = {};
            if (sessionId) {
                headers['X-Session-ID'] = sessionId;
            }

            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
                headers: headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            const data = await response.json();

            // Save session ID for future requests
            if (data.session_id) {
                setSessionId(data.session_id);
                // Pass session ID to parent
                onUploadSuccess({ ...data, sessionId: data.session_id });
            } else {
                onUploadSuccess(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="card fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <UploadIcon className="text-cyan-400" size={32} />
                Upload Document
            </h2>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragging
                        ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                        : 'border-cyan-400/30 hover:border-cyan-400/60'
                    }
        `}
            >
                {!file ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <UploadIcon size={64} className="text-cyan-400/50" />
                        </div>
                        <p className="text-lg text-gray-300">
                            Drag & drop your document here
                        </p>
                        <p className="text-sm text-gray-500">or</p>
                        <label className="btn btn-secondary inline-block cursor-pointer">
                            Browse Files
                            <input
                                type="file"
                                accept=".pdf,.txt"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-4">
                            Supported formats: PDF, TXT
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 text-cyan-400">
                            <FileText size={48} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-white">{file.name}</p>
                            <p className="text-sm text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn btn-primary"
                            >
                                {uploading ? 'Uploading...' : 'Upload & Process'}
                            </button>
                            <button
                                onClick={clearFile}
                                disabled={uploading}
                                className="btn btn-secondary"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    {error}
                </div>
            )}
        </div>
    );
}
