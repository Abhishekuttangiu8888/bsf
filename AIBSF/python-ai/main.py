from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

from services.detector import YOLODetector


app = FastAPI()


# Allow React frontend to communicate with backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load YOLO model once when backend starts

detector = YOLODetector()


@app.get("/")
def home():

    return {
        "message": "AI Border Surveillance Backend is Running",
        "status": "online"
    }


@app.post("/detect")
async def detect_image(
    file: UploadFile = File(...)
):

    # Read uploaded image

    image_bytes = await file.read()


    # Convert bytes to numpy array

    np_array = np.frombuffer(
        image_bytes,
        np.uint8
    )


    # Decode image using OpenCV

    frame = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR
    )


    # Check if image is valid

    if frame is None:

        return {
            "success": False,
            "message": "Invalid image file"
        }


    # Run YOLO detection

    result = detector.detect(frame)


    return {

        "success": True,

        "detections":
            result["detections"],

        "counts":
            result["counts"]

    }