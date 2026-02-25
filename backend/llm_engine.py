import os
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

# Note: The user will need to provide their own API key in a .env file or environment variable.
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print(f"Warning: GOOGLE_API_KEY not found at {env_path}. LLM features will be disabled.")

class LegalLLM:
    def __init__(self, model_name: str = "gemini-2.0-flash"):
        self.model_name = model_name
        self.env_path = os.path.join(os.path.dirname(__file__), ".env")
        load_dotenv(dotenv_path=self.env_path)
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            print(f"Warning: GOOGLE_API_KEY not found at {self.env_path}.")

    async def generate_legal_content(self, prompt: str, context: str = "") -> str:
        """Generate legal content with fallback model support."""
        if not self.api_key:
            return "Error: GOOGLE_API_KEY is not configured."

        # Try multiple model name variations based on list_models() feedback
        models_to_try = [
            self.model_name, 
            "gemini-2.0-flash-lite", 
            "gemini-flash-latest",
            "gemini-pro-latest"
        ]
        
        last_error = ""
        for model_alias in models_to_try:
            try:
                # The SDK handle names with or without 'models/'
                model = genai.GenerativeModel(model_alias)
                
                full_prompt = f"""
                You are a highly experienced Legal Assistant specializing in Indian Law. 
                Use the provided legal context to answer the query or draft the requested document. 
                
                LEGAL CONTEXT:
                {context}
                
                USER REQUEST:
                {prompt}
                
                Your response should be professional, well-structured, and use standard legal terminology. 
                Use Markdown for formatting. cite the sources if used.
                """
                
                response = model.generate_content(full_prompt)
                return response.text
            except Exception as e:
                last_error = str(e)
                continue
        
        error_msg = f"Failed to generate content after trying multiple models. Last error: {last_error}"
        with open("llm_error.log", "a") as f:
            f.write(f"LLM Final Failure: {error_msg}\n")
        return error_msg

# Singleton instance
llm_engine = LegalLLM()
