import pytest
import os
from llm_engine import LegalLLM

@pytest.mark.asyncio
async def test_llm_initialization():
    llm = LegalLLM()
    assert llm.model_name is not None
    assert llm.api_key is not None

@pytest.mark.asyncio
async def test_generate_content_simple():
    llm = LegalLLM()
    # This might fail without a real API key in the test environment, 
    # but we can check if it attempts to call or returns an error string
    response = await llm.generate_legal_content("Say test")
    assert isinstance(response, str)
    assert len(response) > 0
    assert "Error" not in response # Assuming API key is set correctly in .env
