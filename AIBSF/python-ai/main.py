from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import os
import shutil
import uuid

from services.detector import YOLODetector
from services.video_detector import YOLOVideoDetector
from services.threat_service import analyze_threats
from services.alert_service import create_alerts
from models.camera_data import get_camera


app = FastAPI(
    title="AI Border Surveillance System"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# LOAD YOLO MODELS

detector = YOLODetector()

video_detector = YOLOVideoDetector()


# HOME ROUTE

@app.get("/")
def home():

    return {
        "message": "AI Border Surveillance Backend is Running",
        "status": "online"
    }


# IMAGE DETECTION

@app.post("/detect")
async def detect_image(
    file: UploadFile = File(...)
):

    try:

        contents = await file.read()

        if not contents:

            return {
                "success": False,
                "message": "Empty image file"
            }


        import numpy as np
        import cv2


        image_array = np.frombuffer(
            contents,
            np.uint8
        )


        frame = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )


        if frame is None:

            return {
                "success": False,
                "message": "Invalid image file"
            }


        result = detector.detect(
            frame
        )


        return {

            "success": True,

            "detections":
                result.get(
                    "detections",
                    []
                ),

            "counts":
                result.get(
                    "counts",
                    {}
                )

        }


    except Exception as error:

        return {

            "success": False,

            "message": str(error)

        }


# VIDEO DETECTION

@app.post("/detect-video")
async def detect_video(

    camera_id: str = Form(...),

    file: UploadFile = File(...)

):

    video_path = None


    try:

        # CHECK CAMERA

        camera = get_camera(
            camera_id
        )


        if not camera:

            return {

                "success": False,

                "message":
                    f"Camera '{camera_id}' not found"

            }


        # CHECK VIDEO FILE

        if not file.filename:

            return {

                "success": False,

                "message":
                    "No video file selected"

            }


        # GET FILE EXTENSION

        file_extension = os.path.splitext(
            file.filename
        )[1]


        # CREATE TEMP FOLDER

        os.makedirs(
            "temp",
            exist_ok=True
        )


        # CREATE TEMP VIDEO PATH

        video_path = os.path.join(

            "temp",

            f"{uuid.uuid4()}{file_extension}"

        )


        # SAVE UPLOADED VIDEO

        with open(
            video_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # RUN YOLO VIDEO DETECTION

        result = video_detector.detect(
            video_path
        )


        # CHECK DETECTOR RESULT

        if not result.get("success"):

            return result


        # GET DETECTIONS

        detections = result.get(

            "detections",

            {}

        )


        # GET MAX OBJECTS
        # DETECTED IN A SINGLE FRAME

        max_objects = result.get(

            "maxObjectsInSingleFrame",

            {}

        )


        # ANALYZE THREATS

        threat_analysis = analyze_threats(

            detections=detections,

            max_objects_in_single_frame=max_objects

        )


        # CREATE ALERTS
        # AND ASSIGN THEM TO THE CAMERA OFFICER

        alerts = create_alerts(

            camera,

            threat_analysis

        )


        # RETURN COMPLETE RESULT

        return {

            "success": True,


            # CAMERA INFORMATION

            "camera": {

                "id": camera["id"],

                "name": camera["name"],

                "location": camera["location"],

                "sector": camera["sector"],

                "coverageRadius":
                    camera["coverageRadius"],

                "assignedOfficer":
                    camera["assignedOfficer"]

            },


            # VIDEO INFORMATION

            "totalFrames":

                result.get(
                    "totalFrames",
                    0
                ),


            # YOLO DETECTIONS

            "detections":

                detections,


            # MAXIMUM OBJECTS
            # IN ONE FRAME

            "maxObjectsInSingleFrame":

                max_objects,


            # AI THREAT ANALYSIS

            "threatAnalysis":

                threat_analysis,


            # GENERATED ALERTS

            "alerts":

                alerts

        }


    except Exception as error:

        return {

            "success": False,

            "message": str(error)

        }


    finally:

        # DELETE TEMP VIDEO

        if (

            video_path

            and

            os.path.exists(
                video_path
            )

        ):

            try:

                os.remove(
                    video_path
                )

            except Exception:

                pass