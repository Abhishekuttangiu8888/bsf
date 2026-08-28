from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from services.detector import YOLODetector
from services.video_detector import YOLOVideoDetector
from services.threat_service import analyze_threat

import shutil
import os
import uuid


# =====================================
# CREATE FASTAPI APPLICATION
# =====================================

app = FastAPI(
    title="AI Border Surveillance Backend"
)


# =====================================
# ENABLE CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================
# LOAD AI MODELS
# =====================================

detector = YOLODetector()

video_detector = YOLOVideoDetector()


# =====================================
# HOME ROUTE
# =====================================

@app.get("/")
def home():

    return {
        "message": "AI Border Surveillance Backend is Running",
        "status": "online"
    }


# =====================================
# IMAGE DETECTION
# =====================================

@app.post("/detect")
async def detect_image(
    file: UploadFile = File(...)
):

    temp_filename = (
        f"temp_{uuid.uuid4()}"
    )


    try:

        # SAVE UPLOADED IMAGE

        with open(
            temp_filename,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # RUN YOLO IMAGE DETECTION

        results = detector.detect(
            temp_filename
        )


        return {

            "success": True,

            **results
        }


    except Exception as error:

        return {

            "success": False,

            "message": str(error)
        }


    finally:

        # DELETE TEMPORARY FILE

        if os.path.exists(
            temp_filename
        ):

            os.remove(
                temp_filename
            )


# =====================================
# VIDEO DETECTION + THREAT ANALYSIS
# =====================================

@app.post("/detect-video")
async def detect_video(
    file: UploadFile = File(...)
):

    temp_filename = (
        f"temp_{uuid.uuid4()}.mp4"
    )


    try:

        # SAVE UPLOADED VIDEO

        with open(
            temp_filename,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # =================================
        # RUN YOLO VIDEO DETECTION
        # =================================

        results = video_detector.detect_video(
            temp_filename
        )


        # =================================
        # ANALYZE THREATS
        # =================================

        threat_analysis = analyze_threat(

            detections=
                results["detections"],

            max_objects_in_single_frame=
                results["maxObjectsInSingleFrame"],

            total_frames=
                results["totalFrames"]

        )


        # =================================
        # RETURN FINAL RESULT
        # =================================

        return {

            "success": True,


            "totalFrames":
                results["totalFrames"],


            # Total detections across
            # the entire video

            "detections":
                results["detections"],


            # Maximum objects visible
            # simultaneously in one frame

            "maxObjectsInSingleFrame":
                results[
                    "maxObjectsInSingleFrame"
                ],


            # AI threat analysis

            "threatAnalysis":
                threat_analysis

        }


    except Exception as error:

        return {

            "success": False,

            "message": str(error)
        }


    finally:

        # DELETE TEMPORARY VIDEO FILE

        if os.path.exists(
            temp_filename
        ):

            os.remove(
                temp_filename
            )