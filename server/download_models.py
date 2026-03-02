# server/download_models.py
import os
import requests
from tqdm import tqdm

MODELS_DIR = "models"
LLM_URL = "https://huggingface.co/lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF/resolve/main/Meta-Llama-3-8B-Instruct-Q4_K_M.gguf"
LLM_FILENAME = "llama-3-8b-instruct.Q4_K_M.gguf"

def download_file(url, filename):
    if os.path.exists(filename):
        print(f"✅ {filename} already exists.")
        return

    print(f"📥 Downloading {filename}...")
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(filename, 'wb') as file, tqdm(
        desc=filename,
        total=total_size,
        unit='iB',
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for data in response.iter_content(chunk_size=1024):
            size = file.write(data)
            bar.update(size)

if __name__ == "__main__":
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
    
    download_file(LLM_URL, os.path.join(MODELS_DIR, LLM_FILENAME))
    print("✨ All specified models downloaded.")
