from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict
import os

from rag_system import rag_engine
from llm_engine import llm_engine
from templates import get_template

app = FastAPI(title="Legal Assistant API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str
    template: Optional[str] = None

class Response(BaseModel):
    answer: str
    citations: List[Dict] = []

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/query", response_model=Response)
async def query_legal_docs(query: Query):
    try:
        # 1. Retrieve relevant context
        results = rag_engine.query(query.text, k=3)
        context = "\n\n".join([r['content'] for r in results])
        citations = [r['metadata'] for r in results]

        # 2. Prepare prompt (use template if provided)
        prompt_instruction = ""
        if query.template:
            prompt_instruction = get_template(query.template)
        
        final_prompt = f"{prompt_instruction}\n\nUser Query: {query.text}" if prompt_instruction else query.text

        # 3. Generate response using LLM
        answer = await llm_engine.generate_legal_content(final_prompt, context)
        
        return {
            "answer": answer,
            "citations": citations
        }
    except Exception as e:
        print(f"Error in /query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/draft", response_model=Response)
async def draft_document(query: Query):
    if not query.template:
        raise HTTPException(status_code=400, detail="Template name is required for drafting.")
    return await query_legal_docs(query)

# Serve static files from the 'static' directory if it exists
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

    # Catch-all route for SPA support
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index_path = os.path.join("static", "index.html")
        if os.path.exists(index_path):
            from fastapi.responses import FileResponse
            return FileResponse(index_path)
        return {"message": "Legal Assistant API - Static files not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
