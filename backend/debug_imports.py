import sys
import os

log_file = "debug_out.txt"

with open(log_file, "w") as f:
    f.write(f"Python Executable: {sys.executable}\n")
    f.write(f"Path: {sys.path}\n")

    try:
        f.write("Attempting: import langchain\n")
        import langchain
        f.write(f"Success. Version: {langchain.__version__}\n")
        f.write(f"Location: {langchain.__file__}\n")
    except ImportError as e:
        f.write(f"Failed to import langchain: {e}\n")

    try:
        f.write("Attempting: from langchain.text_splitter import RecursiveCharacterTextSplitter\n")
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        f.write("Success.\n")
    except ImportError as e:
        f.write(f"Failed old import path: {e}\n")
        try:
            f.write("Attempting: from langchain_text_splitters import RecursiveCharacterTextSplitter\n")
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            f.write("Success with new path.\n")
        except ImportError as e2:
            f.write(f"Failed new import path: {e2}\n")

    try:
        f.write("Attempting to import services.chunker\n")
        from services import chunker
        f.write("Success importing chunker.\n")
    except Exception as e:
        f.write(f"Failed importing chunker: {e}\n")
