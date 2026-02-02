import uvicorn
import traceback
import sys
import os

if __name__ == "__main__":
    log_file = "startup_error.log"
    try:
        print("Starting server via uvicorn.run()...")
        from main import app
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    except Exception as e:
        with open(log_file, "w") as f:
            f.write(f"Startup failed at {os.getcwd()}\n")
            f.write(f"Error: {str(e)}\n\n")
            traceback.print_exc(file=f)
        print(f"Error captured in {log_file}")
        sys.exit(1)
