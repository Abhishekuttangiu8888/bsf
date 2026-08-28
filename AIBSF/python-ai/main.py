from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import os
import shutil

from services.detector import YOLODetector
from services.video_detector import VideoDetector


app = FastAPI(
    title="AI Border Surveillance API"
)


# ==========================================
# CORS
# Allows React frontend to connect
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# LOAD AI MODELS
# Models are loaded only once when
# the backend starts
# ==========================================

detector = YOLODetector()

video_detector = VideoDetector()


# ==========================================
# HOME API
# ==========================================

@app.get("/")
def home():

    return {
        "message": "AI Border Surveillance Backend is Running",
        "status": "online"
    }


# ==========================================
# IMAGE DETECTION API
# ==========================================

@app.post("/detect")
async def detect_image(
    file: UploadFile = File(...)
):

    # Read uploaded image

    image_bytes = await file.read()


    # Convert image bytes to numpy array

    np_array = np.frombuffer(
        image_bytes,
        np.uint8
    )


    # Decode image

    frame = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR
    )


    # Check whether image is valid

    if frame is None:

        return {
            "success": False,
            "message": "Invalid image file"
        }


    # Run YOLO detection

    result = detector.detect(
        frame
    )


    # Return detection result

    return {

        "success": True,

        "detections":
            result["detections"],

        "counts":
            result["counts"]

    }


# ==========================================
# VIDEO DETECTION API
# ==========================================

@app.post("/detect-video")
async def detect_video(
    file: UploadFile = File(...)
):

    # Create temporary folder

    os.makedirs(
        "temp",
        exist_ok=True
    )


    # Create path for uploaded video

    video_path = os.path.join(
        "temp",
        file.filename
    )


    # Save uploaded video temporarily

    with open(
        video_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # Run YOLO video detection

    result = video_detector.process_video(
        video_path
    )


    # Delete temporary video after processing

    if os.path.exists(
        video_path
    ):

        os.remove(
            video_path
        )


    # Return result

    return result