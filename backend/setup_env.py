#!/usr/bin/env python3
"""
Environment Setup Script for AI Todo App

This script helps users set up their environment variables for the AI integration.
It checks for existing .env files and guides users through the setup process.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

def check_env_file():
    """Check if .env file exists and show its status"""
    env_path = Path(".env")
    env_example_path = Path("env.example")
    
    print("🔍 Checking environment configuration...")
    print(f"Current directory: {os.getcwd()}")
    print(f".env file exists: {env_path.exists()}")
    print(f"env.example exists: {env_example_path.exists()}")
    
    if env_path.exists():
        print("\n✅ .env file found!")
        return True
    else:
        print("\n❌ .env file not found")
        return False

def show_env_example():
    """Show the contents of env.example"""
    env_example_path = Path("env.example")
    
    if env_example_path.exists():
        print("\n📋 Here's what your .env file should contain:")
        print("=" * 50)
        with open(env_example_path, 'r') as f:
            print(f.read())
        print("=" * 50)
    else:
        print("\n❌ env.example file not found")

def create_env_file():
    """Create .env file from env.example"""
    env_path = Path(".env")
    env_example_path = Path("env.example")
    
    if not env_example_path.exists():
        print("❌ env.example file not found. Cannot create .env file.")
        return False
    
    try:
        # Copy env.example to .env
        with open(env_example_path, 'r') as src, open(env_path, 'w') as dst:
            dst.write(src.read())
        
        print("✅ Created .env file from env.example")
        print("📝 Please edit .env file and add your API keys")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def check_api_keys():
    """Check which API keys are configured"""
    print("\n🔑 Checking API key configuration...")
    
    api_keys = {
        "OpenAI": os.getenv("OPENAI_API_KEY"),
        "Anthropic": os.getenv("ANTHROPIC_API_KEY"),
        "Google": os.getenv("GOOGLE_API_KEY"),
        "Cohere": os.getenv("COHERE_API_KEY"),
        "Ollama": os.getenv("OLLAMA_BASE_URL")
    }
    
    configured_keys = []
    for provider, key in api_keys.items():
        if key and key != f"your_{provider.lower()}_api_key_here":
            configured_keys.append(provider)
            print(f"✅ {provider}: Configured")
        else:
            print(f"❌ {provider}: Not configured")
    
    if configured_keys:
        print(f"\n🎉 You have {len(configured_keys)} AI provider(s) configured: {', '.join(configured_keys)}")
        return True
    else:
        print("\n⚠️  No AI providers configured. AI features will use fallback mode.")
        return False

def main():
    load_dotenv()

    """Main setup function"""
    print("🚀 AI Todo App - Environment Setup")
    print("=" * 40)
    
    # Check if we're in the backend directory
    if not Path("env.example").exists():
        print("❌ Please run this script from the backend directory")
        print("   cd backend && python setup_env.py")
        sys.exit(1)
    
    # Check current environment
    env_exists = check_env_file()
    
    if not env_exists:
        print("\n📝 Creating .env file...")
        if create_env_file():
            print("\n⚠️  IMPORTANT: Edit the .env file and add your API keys!")
            print("   You can get API keys from:")
            print("   - OpenAI: https://platform.openai.com/api-keys")
            print("   - Anthropic: https://console.anthropic.com/")
            print("   - Google: https://makersuite.google.com/app/apikey")
            print("   - Cohere: https://dashboard.cohere.ai/api-keys")
        else:
            sys.exit(1)
    
    # Show example configuration
    show_env_example()
    
    # Check API keys
    has_keys = check_api_keys()
    
    print("\n" + "=" * 40)
    if has_keys:
        print("🎉 Setup complete! You can now use AI features.")
        print("   Start the app with: python main.py")
    else:
        print("⚠️  Setup incomplete. AI features will work with fallback mode.")
        print("   To enable full AI features, add at least one API key to .env")
    
    print("\n📚 For more information, see AI_INTEGRATION.md")

if __name__ == "__main__":
    main()
