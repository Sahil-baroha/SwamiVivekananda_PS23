import socket
import requests
import sys

def check_port(host, port):
    print(f"Checking {host}:{port}...")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    try:
        result = s.connect_ex((host, port))
        if result == 0:
            print(f"✅ Port {port} is OPEN on {host}")
            return True
        else:
            print(f"❌ Port {port} is CLOSED or unreachable on {host} (Error code: {result})")
            return False
    except Exception as e:
        print(f"❌ Error checking port: {e}")
        return False
    finally:
        s.close()

def check_health_endpoint(url):
    print(f"Testing URL: {url}")
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            print(f"✅ API Reachable! Status: {response.status_code}")
            print(f"Response: {response.json()}")
        else:
            print(f"⚠️ API Reachable but returned error: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection Refused (Server likely not running or blocked)")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("--- Network Troubleshooting Script ---")
    
    # 1. Check if something is listening
    is_open = check_port("127.0.0.1", 8000)
    
    if is_open:
        # 2. Try to hit the health endpoint
        check_health_endpoint("http://127.0.0.1:8000/health")
    else:
        print("\nSUGGESTION: The backend server is NOT running or not listening on 127.0.0.1.")
        print("Try running with 0.0.0.0 to bind to all interfaces:")
        print("uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
