import sys
import os

# Add backend directory to path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from mongoengine import connect, disconnect
from v1.models import User
from config import config
import argparse

def create_super_admin(email):
    # Determine Host: Use localhost if running locally, else config default
    # Since this is a manual script run on host, we default to localhost for mapped port
    host = "localhost" 
    
    # Construct URI
    # mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
    mongo_uri = f"mongodb://{config.DATABASE_USERNAME}:{config.DATABASE_PASSWORD}@{host}:27017/{config.DATABASE_NAME}?authSource={config.DATABASE_AUTHENTICATION_SOURCE}"
    
    print(f"Connecting to MongoDB at {host}...")
    
    try:
        connect(host=mongo_uri)
        print("Connected successfully.")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    user = User.objects(email=email).first()
    
    if not user:
        print(f"User with email '{email}' not found.")
        print("Please register the user first via the application.")
        return

    if user.role == 'super_admin':
        print(f"User '{email}' is already a Super Admin.")
        return

    user.role = 'super_admin'
    user.save()
    print(f"Successfully promoted '{email}' to Super Admin.")
    
    disconnect()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Promote a user to Super Admin")
    parser.add_argument("email", help="Email of the user to promote")
    args = parser.parse_args()
    
    create_super_admin(args.email)
