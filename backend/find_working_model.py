import os
import google.generativeai as genai
import sys
from dotenv import load_dotenv

print(f"Python: {sys.version}")
print(f"GenAI Version: {genai.__version__}")
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("Starting model discovery...")
try:
    models = list(genai.list_models())
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f"Testing model: {m.name}")
            try:
                model = genai.GenerativeModel(m.name)
                response = model.generate_content("Hi")
                print(f"SUCCESS with {m.name}: {response.text[:20]}...")
                break
            except Exception as e:
                print(f"FAILED with {m.name}: {e}")
except Exception as e:
    print(f"Discovery failed: {e}")
