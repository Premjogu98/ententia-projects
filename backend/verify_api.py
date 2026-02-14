import requests
import time
import sys

BASE_URL = "http://localhost:8000/api/v1/insights"
AUTH_URL = "http://localhost:8000/api/v1/insights"

def log(msg, color="green"):
    colors = {"green": "\033[92m", "red": "\033[91m", "reset": "\033[0m"}
    print(f"{colors.get(color, '')}{msg}{colors['reset']}")

def wait_for_backend():
    retries = 30
    for i in range(retries):
        try:
            resp = requests.get(f"{BASE_URL}")
            if resp.status_code == 200:
                log("Backend is Healthy!")
                return
        except requests.ConnectionError:
            pass
        log(f"Waiting for backend... ({i+1}/{retries})", "reset")
        time.sleep(2)
    log("Backend failed to start.", "red")
    sys.exit(1)

def run_tests():
    session = requests.Session()
    email = f"test_{int(time.time())}@example.com"
    password = "password123"

    # Register
    log(f"Registering user {email}...")
    resp = session.post(f"{AUTH_URL}/register", json={"email": email, "password": password})
    if resp.status_code != 200:
        log(f"Registration failed: {resp.text}", "red")
        return
    log("Registration successful.")

    # Login
    log("Logging in...")
    resp = session.post(f"{AUTH_URL}/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        log(f"Login failed: {resp.text}", "red")
        return
    token = resp.json()["access_token"]
    session.headers.update({"Authorization": f"Bearer {token}"})
    log("Login successful.")

    # Create Insight
    log("Creating insight...")
    payload = {
        "title": "MongoEngine Migration",
        "content": "Testing the migration to MongoDB with MongoEngine.",
        "tags": ["testing", "mongodb"]
    }
    resp = session.post(f"{BASE_URL}/", json=payload)
    if resp.status_code != 201:
        log(f"Create failed: {resp.text}", "red")
        return
    insight = resp.json()
    insight_id = insight["id"]  # or _id depending on serialization
    log(f"Insight created: {insight_id}")

    # List Insights
    log("Listing insights...")
    resp = session.get(f"{BASE_URL}/")
    insights = resp.json()
    if len(insights) == 0:
        log("List failed: No insights found", "red")
        return
    log(f"Found {len(insights)} insights.")

    # Update Insight
    log(f"Updating insight {insight_id}...")
    update_payload = {"title": "MongoEngine Migration Updated"}
    resp = session.put(f"{BASE_URL}/{insight_id}", json=update_payload)
    if resp.status_code != 200:
        log(f"Update failed: {resp.text}", "red")
        return
    updated_insight = resp.json()
    if updated_insight["title"] != "MongoEngine Migration Updated":
        log("Update verification failed.", "red")
        return
    log("Update successful.")

    # Delete Insight
    log(f"Deleting insight {insight_id}...")
    resp = session.delete(f"{BASE_URL}/{insight_id}")
    if resp.status_code != 204:
        log(f"Delete failed: {resp.text}", "red")
        return
    log("Delete successful.")

    # Verify Delete
    resp = session.get(f"{BASE_URL}/{insight_id}")
    if resp.status_code != 404:
        log("Delete verification failed (Insight still exists).", "red")
        return
    log("Delete verification successful.")

if __name__ == "__main__":
    wait_for_backend()
    run_tests()
