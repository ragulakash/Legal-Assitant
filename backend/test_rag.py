import pytest
from rag_system import rag_engine

def test_rag_initialization():
    assert rag_engine.vector_store is not None
    assert rag_engine.embeddings is not None

def test_rag_query_structure():
    results = rag_engine.query("privacy", k=1)
    assert isinstance(results, list)
    if len(results) > 0:
        assert "content" in results[0]
        assert "metadata" in results[0]
        assert "source" in results[0]["metadata"]

def test_rag_no_results():
    results = rag_engine.query("nonexistent_terminology_xyz_123", k=1)
    # RAG should still return a result if the database is populated, 
    # but we check for list structure
    assert isinstance(results, list)
