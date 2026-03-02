# server/local_ai_server.py
# ============================================
# NAVARASA MIRROR — LOCAL VISION SERVER
# Only handles emotion detection via PyTorch.
# LLM → Gemini API (frontend)
# TTS → Sarvam AI (frontend)
# ============================================
import base64
import io
import torch
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from transformers import pipeline

# ===== CONFIG =====
PORT = 8000
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
VISION_MODEL = "dima806/facial_emotions_image_detection"

print(f"🪞 Navarasa Mirror Vision Server")
print(f"   Device: {DEVICE}")
print(f"   Model:  {VISION_MODEL}")

app = FastAPI(title="Navarasa Mirror — Vision")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== SINGLETON MODEL =====
vision_pipeline = None

def get_vision():
    global vision_pipeline
    if not vision_pipeline:
        print("📥 Loading emotion detection model...")
        vision_pipeline = pipeline(
            "image-classification",
            model=VISION_MODEL,
            device=0 if DEVICE == "cuda" else -1
        )
        print("✅ Vision model ready!")
    return vision_pipeline

# ===== EMOTION → RASA MAPPING =====
EMOTION_TO_RASA = {
    "happy": "hasya",
    "sad": "karuna",
    "angry": "raudra",
    "fear": "bhayanaka",
    "surprise": "adbhuta",
    "neutral": "shanta",
    "disgust": "bibhatsa",
}

RASA_NUANCES = {
    "hasya": "The mirror sees a warmth radiating from within — the light of genuine joy.",
    "shringara": "A gentle glow of contentment, like the first light of dawn touching a still lake.",
    "karuna": "There is a depth in your gaze — the tenderness of one who has known both love and loss.",
    "raudra": "Sacred fire burns behind your eyes — not destruction, but the fierce clarity of truth.",
    "bhayanaka": "The mirror sees the widening of awareness — the trembling before something vast.",
    "adbhuta": "Wonder illuminates your features — the universe has surprised you with its mystery.",
    "shanta": "Stillness. The mirror reflects what the ancients sought — a mind like an unrippled lake.",
    "bibhatsa": "Discernment sharpens your gaze — the inner wisdom that separates truth from illusion.",
    "veera": "Determination sets your jaw — the quiet courage before a great undertaking.",
}

# ===== API =====

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "device": DEVICE,
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
        "model": VISION_MODEL,
    }

class VisionRequest(BaseModel):
    image_base64: str

@app.post("/vision")
async def detect_emotion(req: VisionRequest):
    pipe = get_vision()
    try:
        # Decode base64 image
        img_data = req.image_base64.split(",")[-1]
        image = Image.open(io.BytesIO(base64.b64decode(img_data))).convert("RGB")

        # Run inference
        results = pipe(image)
        top = results[0]
        emotion = top["label"].lower()
        confidence = top["score"]

        # Map to Rasa — happy with low confidence → shringara (love/beauty)
        if emotion == "happy" and confidence < 0.55:
            rasa = "shringara"
        else:
            rasa = EMOTION_TO_RASA.get(emotion, "shanta")

        nuance = RASA_NUANCES.get(rasa, RASA_NUANCES["shanta"])

        return {
            "emotion": emotion,
            "confidence": round(confidence, 3),
            "rasaSuggestion": rasa,
            "nuance": nuance,
            "allEmotions": {r["label"].lower(): round(r["score"], 3) for r in results},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Pre-load model on startup
    get_vision()
    uvicorn.run(app, host="0.0.0.0", port=PORT)
