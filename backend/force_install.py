import subprocess
import sys
import os

packages = [
    "fastapi",
    "uvicorn",
    "python-multipart",
    "pymupdf",
    "langchain",
    "langchain-community",
    "openai",
    "sentence-transformers",
    "python-dotenv",
    "requests",
    "numpy",
    "tiktoken"
]

log_file = "install_log.txt"

def install():
    print(f"Installing dependencies to: {sys.executable}")
    with open(log_file, "w") as f:
        f.write(f"Interpreter: {sys.executable}\n")
        f.write("Starting installation...\n")
        try:
            for package in packages:
                print(f"Installing {package}...")
                f.write(f"Installing {package}...\n")
                # Use --no-cache-dir to avoid corrupted cache issues
                subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--no-cache-dir"], stdout=f, stderr=f)
                f.write(f"Successfully installed {package}\n")
            
            f.write("\nVerification:\n")
            # Verify import
            import langchain
            f.write(f"LangChain imported successfully.\n")
            f.write("ALL INSTALLED SUCCESSFULLY.\n")
            print("Installation SUCCESS.")
        except Exception as e:
            f.write(f"\nERROR: {str(e)}\n")
            print(f"FAILED. Check {log_file}")
            sys.exit(1)

if __name__ == "__main__":
    install()
