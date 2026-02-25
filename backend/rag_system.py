import os
from typing import List, Dict, Any
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class LegalRAG:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self.embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            length_function=len,
        )
        self.vector_store = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings,
            collection_name="legal_docs"
        )

    def add_documents(self, texts: List[str], metadatas: List[Dict[str, Any]] = None):
        """Add text documents to the vector store."""
        docs = []
        for i, text in enumerate(texts):
            metadata = metadatas[i] if metadatas else {"source": "unknown"}
            chunks = self.text_splitter.split_text(text)
            for chunk in chunks:
                docs.append(Document(page_content=chunk, metadata=metadata))
        
        self.vector_store.add_documents(docs)
        print(f"Added {len(docs)} chunks to the vector store.")

    def query(self, query_text: str, k: int = 3) -> List[Dict[str, Any]]:
        """Query the vector store for relevant document chunks."""
        results = self.vector_store.similarity_search(query_text, k=k)
        formatted_results = []
        for doc in results:
            formatted_results.append({
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        return formatted_results

# Singleton instance
persist_path = os.path.join(os.path.dirname(__file__), "chroma_db")
rag_engine = LegalRAG(persist_directory=persist_path)
