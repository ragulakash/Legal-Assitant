import os
from rag_system import rag_engine

def ingest_from_directory(directory_path: str):
    """Recursively ingest all .txt files from a directory."""
    if not os.path.exists(directory_path):
        print(f"Directory {directory_path} does not exist.")
        return

    texts = []
    metadatas = []

    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".txt"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                        texts.append(text)
                        metadatas.append({"source": file, "path": file_path})
                        print(f"Loaded {file}")
                except Exception as e:
                    print(f"Error loading {file}: {e}")

    if texts:
        rag_engine.add_documents(texts, metadatas=metadatas)
        print("Ingestion complete.")
    else:
        print("No documents found to ingest.")

if __name__ == "__main__":
    # Path relative to backend/
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data", "sample_cases")
    ingest_from_directory(data_dir)
