import base64
import io
import traceback
from typing import Optional

import numpy as np
from PIL import Image
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .yolo_detector import detector
from .threat_detector import threat_detector


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Border Surveillance API",
    description="YOLO-powered AI Border Surveillance Backend",
    version="1.1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
async def startup_event():

    print()
    print("========================================")
    print(" AI BORDER SURVEILLANCE BACKEND")
    print("========================================")

    print(" FastAPI       : ONLINE")

    if detector.is_available():
        print(" YOLO          : LOADED")
    else:
        print(" YOLO          : OFFLINE")

    print(" Threat Engine : ONLINE")

    print(" API           : http://127.0.0.1:8000")
    print(" Documentation : http://127.0.0.1:8000/docs")

    print("========================================")
    print()


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():

    return {
        "success": True,
        "message": "AI Border Surveillance Backend is running",
        "service": "YOLO Detection API",
        "status": "ONLINE"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
async def health():

    return {
        "success": True,
        "backend": "ONLINE",
        "yolo": "LOADED" if detector.is_available() else "OFFLINE",
        "threatEngine": "ONLINE"
    }


# ============================================================
# IMAGE DECODER
# ============================================================

async def read_uploaded_image(file: UploadFile):

    try:

        contents = await file.read()

        if not contents:

            raise ValueError(
                "Uploaded file is empty"
            )

        print()
        print("----------------------------------------")
        print("IMAGE RECEIVED")
        print("----------------------------------------")
        print(f"Filename : {file.filename}")
        print(f"Type     : {file.content_type}")
        print(f"Size     : {len(contents)} bytes")

        image = Image.open(
            io.BytesIO(contents)
        )

        image = image.convert("RGB")

        image_array = np.array(image)

        print(f"Image size : {image.size}")
        print(f"Array shape: {image_array.shape}")
        print("Image decode: SUCCESS")
        print("----------------------------------------")

        return image_array

    except Exception as error:

        print()
        print("IMAGE DECODING ERROR")
        print(error)
        traceback.print_exc()

        raise HTTPException(
            status_code=400,
            detail=f"Could not read image: {str(error)}"
        )


# ============================================================
# DETECT IMAGE
# ============================================================

@app.post("/detect")
async def detect_image(
    file: UploadFile = File(...),
    confidence: float = Query(
        default=0.35,
        ge=0.0,
        le=1.0
    )
):

    print()
    print("========================================")
    print(" POST /detect")
    print("========================================")

    try:

        if not detector.is_available():

            raise HTTPException(
                status_code=503,
                detail="YOLO detector is not available"
            )

        # ----------------------------------------------------
        # READ IMAGE
        # ----------------------------------------------------

        image = await read_uploaded_image(
            file
        )

        print(
            f"Running YOLO with confidence: "
            f"{confidence}"
        )

        # ----------------------------------------------------
        # YOLO DETECTION
        # ----------------------------------------------------

        result = detector.detect_with_summary(
            image,
            confidence
        )

        detections = result.get(
            "detections",
            []
        )

        print("YOLO detection completed")
        print(
            f"Detection count: "
            f"{len(detections)}"
        )

        # ----------------------------------------------------
        # THREAT ANALYSIS
        # ----------------------------------------------------

        threat_result = (
            threat_detector.process_detections(
                detections=detections
            )
        )

        print(
            "Threat analysis completed"
        )

        print(
            f"Threat level: "
            f"{threat_result['analysis']['threatLevel']}"
        )

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "success": True,

            "filename": file.filename,

            "confidence": confidence,

            "detectionCount":
                result.get(
                    "detectionCount",
                    0
                ),

            "detections":
                detections,

            "classes":
                result.get(
                    "classes",
                    {}
                ),

            "threat":
                threat_result["analysis"],

            "alertCreated":
                threat_result["alertCreated"],

            "alert":
                threat_result["alert"]

        }

    except HTTPException:

        raise

    except Exception as error:

        print()
        print("========================================")
        print(" DETECTION ERROR")
        print("========================================")
        print(error)

        traceback.print_exc()

        print("========================================")

        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(error)}"
        )


# ============================================================
# ANNOTATED IMAGE
# ============================================================

@app.post("/detect/annotated")
async def detect_annotated(
    file: UploadFile = File(...),
    confidence: float = Query(
        default=0.35,
        ge=0.0,
        le=1.0
    )
):

    try:

        if not detector.is_available():

            raise HTTPException(
                status_code=503,
                detail="YOLO detector is not available"
            )

        image = await read_uploaded_image(
            file
        )

        result = detector.detect_with_summary(
            image,
            confidence
        )

        detections = result[
            "detections"
        ]

        # ----------------------------------------------------
        # THREAT ANALYSIS
        # ----------------------------------------------------

        threat_result = (
            threat_detector.process_detections(
                detections=detections
            )
        )

        # ----------------------------------------------------
        # CREATE ANNOTATED IMAGE
        # ----------------------------------------------------

        pil_image = Image.fromarray(
            image.copy()
        )

        from PIL import ImageDraw

        draw = ImageDraw.Draw(
            pil_image
        )

        for detection in detections:

            box = detection["box"]

            x1 = int(box["x1"])
            y1 = int(box["y1"])
            x2 = int(box["x2"])
            y2 = int(box["y2"])

            class_name = detection[
                "className"
            ]

            confidence_value = detection[
                "confidencePercent"
            ]

            label = (
                f"{class_name} "
                f"{confidence_value}%"
            )

            draw.rectangle(
                [x1, y1, x2, y2],
                outline="red",
                width=3
            )

            draw.text(
                (
                    x1,
                    max(0, y1 - 15)
                ),
                label,
                fill="red"
            )

        # ----------------------------------------------------
        # CONVERT TO JPEG
        # ----------------------------------------------------

        output = io.BytesIO()

        pil_image.save(
            output,
            format="JPEG"
        )

        output.seek(0)

        encoded = base64.b64encode(
            output.read()
        ).decode("utf-8")

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "success": True,

            "filename":
                file.filename,

            "confidence":
                confidence,

            "detectionCount":
                result["detectionCount"],

            "detections":
                detections,

            "classes":
                result["classes"],

            "threat":
                threat_result["analysis"],

            "alertCreated":
                threat_result["alertCreated"],

            "alert":
                threat_result["alert"],

            "image":
                encoded

        }

    except HTTPException:

        raise

    except Exception as error:

        print()
        print("ANNOTATED DETECTION ERROR")
        print(error)

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=(
                "Annotated detection failed: "
                f"{str(error)}"
            )
        )


# ============================================================
# BASE64 FRAME MODEL
# ============================================================

class Base64Frame(BaseModel):

    image: str

    confidence: Optional[float] = 0.35

    cameraId: Optional[int] = None

    cameraName: Optional[str] = (
        "Unknown Camera"
    )

    location: Optional[str] = (
        "Unknown Location"
    )


# ============================================================
# DECODE BASE64 FRAME
# ============================================================

def decode_base64_image(
    image_string: str
):

    try:

        if not image_string:

            raise ValueError(
                "Image data is empty"
            )

        # ----------------------------------------------------
        # REMOVE DATA URL PREFIX
        # ----------------------------------------------------

        if "," in image_string:

            image_string = (
                image_string.split(
                    ",",
                    1
                )[1]
            )

        # ----------------------------------------------------
        # CLEAN BASE64
        # ----------------------------------------------------

        image_string = (
            image_string
            .strip()
        )

        # Add missing padding if necessary

        missing_padding = (
            len(image_string) % 4
        )

        if missing_padding:

            image_string += (
                "=" *
                (4 - missing_padding)
            )

        # ----------------------------------------------------
        # DECODE
        # ----------------------------------------------------

        image_bytes = (
            base64.b64decode(
                image_string,
                validate=True
            )
        )

        # ----------------------------------------------------
        # OPEN IMAGE
        # ----------------------------------------------------

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        return np.array(image)

    except Exception as error:

        raise ValueError(
            f"Invalid base64 image: "
            f"{str(error)}"
        )


# ============================================================
# DETECT FRAME
# ============================================================

@app.post("/detect/frame")
async def detect_frame(
    data: Base64Frame
):

    try:

        if not detector.is_available():

            raise HTTPException(
                status_code=503,
                detail=(
                    "YOLO detector is not available"
                )
            )

        # ----------------------------------------------------
        # DECODE FRAME
        # ----------------------------------------------------

        image = decode_base64_image(
            data.image
        )

        print()
        print("----------------------------------------")
        print("FRAME RECEIVED")
        print("----------------------------------------")
        print(
            f"Camera: {data.cameraName}"
        )
        print(
            f"Location: {data.location}"
        )
        print(
            f"Confidence: {data.confidence}"
        )

        # ----------------------------------------------------
        # YOLO
        # ----------------------------------------------------

        result = detector.detect_frame(
            image,
            data.confidence
        )

        detections = result.get(
            "detections",
            []
        )

        # ----------------------------------------------------
        # THREAT ENGINE
        # ----------------------------------------------------

        threat_result = (
            threat_detector.process_detections(

                detections=detections,

                camera_id=data.cameraId,

                camera_name=data.cameraName,

                location=data.location

            )
        )

        analysis = threat_result[
            "analysis"
        ]

        print(
            f"Detections: "
            f"{len(detections)}"
        )

        print(
            f"Threat level: "
            f"{analysis['threatLevel']}"
        )

        print(
            f"Alert required: "
            f"{analysis['alertRequired']}"
        )

        print("----------------------------------------")

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "success": True,

            "cameraId":
                data.cameraId,

            "cameraName":
                data.cameraName,

            "location":
                data.location,

            "detectionCount":
                result.get(
                    "detectionCount",
                    0
                ),

            "detections":
                detections,

            "classes":
                result.get(
                    "classes",
                    {}
                ),

            "threat":
                analysis,

            "alertCreated":
                threat_result[
                    "alertCreated"
                ],

            "alert":
                threat_result[
                    "alert"
                ]

        }

    except HTTPException:

        raise

    except Exception as error:

        print()
        print("========================================")
        print(" FRAME DETECTION ERROR")
        print("========================================")

        print(error)

        traceback.print_exc()

        print("========================================")

        raise HTTPException(
            status_code=500,
            detail=(
                f"Frame detection failed: "
                f"{str(error)}"
            )
        )


# ============================================================
# DETECT ANNOTATED FRAME
# ============================================================

@app.post("/detect/frame/annotated")
async def detect_annotated_frame(
    data: Base64Frame
):

    try:

        if not detector.is_available():

            raise HTTPException(
                status_code=503,
                detail=(
                    "YOLO detector is not available"
                )
            )

        # ----------------------------------------------------
        # DECODE
        # ----------------------------------------------------

        image = decode_base64_image(
            data.image
        )

        # ----------------------------------------------------
        # YOLO
        # ----------------------------------------------------

        result = detector.detect_frame(
            image,
            data.confidence
        )

        detections = result[
            "detections"
        ]

        # ----------------------------------------------------
        # THREAT ANALYSIS
        # ----------------------------------------------------

        threat_result = (
            threat_detector.process_detections(

                detections=detections,

                camera_id=data.cameraId,

                camera_name=data.cameraName,

                location=data.location

            )
        )

        # ----------------------------------------------------
        # CREATE ANNOTATED IMAGE
        # ----------------------------------------------------

        pil_image = Image.fromarray(
            image.copy()
        )

        from PIL import ImageDraw

        draw = ImageDraw.Draw(
            pil_image
        )

        for detection in detections:

            box = detection["box"]

            x1 = int(box["x1"])
            y1 = int(box["y1"])
            x2 = int(box["x2"])
            y2 = int(box["y2"])

            class_name = detection[
                "className"
            ]

            confidence_value = detection[
                "confidencePercent"
            ]

            label = (
                f"{class_name} "
                f"{confidence_value}%"
            )

            draw.rectangle(
                [x1, y1, x2, y2],
                outline="red",
                width=3
            )

            draw.text(
                (
                    x1,
                    max(0, y1 - 15)
                ),
                label,
                fill="red"
            )

        # ----------------------------------------------------
        # JPEG
        # ----------------------------------------------------

        output = io.BytesIO()

        pil_image.save(
            output,
            format="JPEG"
        )

        encoded = base64.b64encode(
            output.getvalue()
        ).decode("utf-8")

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "success": True,

            "cameraId":
                data.cameraId,

            "cameraName":
                data.cameraName,

            "location":
                data.location,

            "detectionCount":
                result[
                    "detectionCount"
                ],

            "detections":
                detections,

            "classes":
                result[
                    "classes"
                ],

            "threat":
                threat_result[
                    "analysis"
                ],

            "alertCreated":
                threat_result[
                    "alertCreated"
                ],

            "alert":
                threat_result[
                    "alert"
                ],

            "image":
                encoded

        }

    except HTTPException:

        raise

    except Exception as error:

        print()
        print("ANNOTATED FRAME ERROR")
        print(error)

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=(
                "Annotated frame failed: "
                f"{str(error)}"
            )
        )


# ============================================================
# SERVER TEST
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )