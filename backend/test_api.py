import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_health_check():
    await asyncio.sleep(1)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_root_endpoint():
    await asyncio.sleep(2)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert "Legal Assistant API" in response.json()["message"]

@pytest.mark.asyncio
async def test_query_endpoint():
    # This test assumes the RAG engine and LLM are functional
    await asyncio.sleep(2)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"text": "What is privacy?", "template": "summary"}
        response = await ac.post("/query", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "citations" in data
    assert isinstance(data["answer"], str)
    assert len(data["answer"]) > 0

@pytest.mark.asyncio
async def test_draft_endpoint():
    await asyncio.sleep(2)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"text": "Facts: Person A was arrested without warrant.", "template": "petition"}
        response = await ac.post("/draft", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "PETITION" in data["answer"].upper()
