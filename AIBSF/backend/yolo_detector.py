import os
from typing import Any, Dict, List, Optional

from ultralytics import YOLO


# ============================================================
# YOLO CONFIGURATION
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "yolo26n.pt"
)

# Minimum confidence required for a detection
DEFAULT_CONFIDENCE = 0.35


# ============================================================
# YOLO DETECTOR
# ============================================================

class YOLODetector:

    def __init__(
        self,
        model_path: str = MODEL_PATH,
        confidence: float = DEFAULT_CONFIDENCE
    ):

        self.model_path = model_path
        self.confidence = confidence
        self.model: Optional[YOLO] = None
        self.available = False

        self.load_model()


    # ========================================================
    # LOAD MODEL
    # ========================================================

    def load_model(self):

        print("----------------------------------------")
        print("YOLO DETECTOR")
        print("----------------------------------------")
        print(f"Model: {self.model_path}")

        # Check whether model file exists
        if not os.path.exists(self.model_path):

            print("ERROR: YOLO model file not found")
            print(f"Expected location: {self.model_path}")

            self.available = False
            return


        try:

            self.model = YOLO(self.model_path)

            self.available = True

            print("YOLO model loaded successfully")
            print("YOLO STATUS: ONLINE")

        except Exception as error:

            self.model = None
            self.available = False

            print("ERROR: Could not load YOLO model")
            print(error)


    # ========================================================
    # MODEL STATUS
    # ========================================================

    def is_available(self) -> bool:

        return self.available


    # ========================================================
    # DETECT IMAGE
    # ========================================================

    def detect_image(
        self,
        image: Any,
        confidence: Optional[float] = None
    ) -> List[Dict]:

        if not self.available or self.model is None:

            print("YOLO detector is not available")

            return []


        conf = (
            confidence
            if confidence is not None
            else self.confidence
        )


        try:

            results = self.model.predict(
                source=image,
                conf=conf,
                verbose=False
            )


            detections = []


            for result in results:

                names = result.names


                if result.boxes is None:
                    continue


                for box in result.boxes:

                    class_id = int(
                        box.cls[0].item()
                    )


                    confidence_value = float(
                        box.conf[0].item()
                    )


                    coordinates = box.xyxy[0].tolist()


                    x1, y1, x2, y2 = coordinates


                    class_name = names[class_id]


                    detection = {

                        "className": class_name,

                        "classId": class_id,

                        "confidence": confidence_value,

                        "confidencePercent":
                            round(
                                confidence_value * 100,
                                1
                            ),

                        "box": {

                            "x1": round(x1, 2),

                            "y1": round(y1, 2),

                            "x2": round(x2, 2),

                            "y2": round(y2, 2)

                        }

                    }


                    detections.append(
                        detection
                    )


            return detections


        except Exception as error:

            print("YOLO detection error:")
            print(error)

            return []


    # ========================================================
    # DETECT IMAGE WITH SUMMARY
    # ========================================================

    def detect_with_summary(
        self,
        image: Any,
        confidence: Optional[float] = None
    ) -> Dict:

        detections = self.detect_image(
            image,
            confidence
        )


        class_counts = {}


        for detection in detections:

            class_name = detection["className"]


            if class_name not in class_counts:

                class_counts[class_name] = 0


            class_counts[class_name] += 1


        return {

            "success": True,

            "detectionCount":
                len(detections),

            "detections":
                detections,

            "classes":
                class_counts

        }


    # ========================================================
    # DETECT PERSONS
    # ========================================================

    def detect_persons(
        self,
        image: Any,
        confidence: Optional[float] = None
    ) -> List[Dict]:

        detections = self.detect_image(
            image,
            confidence
        )


        persons = [

            detection

            for detection in detections

            if detection["className"].lower()
            == "person"

        ]


        return persons


    # ========================================================
    # DETECT VEHICLES
    # ========================================================

    def detect_vehicles(
        self,
        image: Any,
        confidence: Optional[float] = None
    ) -> List[Dict]:

        detections = self.detect_image(
            image,
            confidence
        )


        vehicle_classes = {

            "car",

            "truck",

            "bus",

            "motorcycle"

        }


        vehicles = [

            detection

            for detection in detections

            if detection["className"].lower()
            in vehicle_classes

        ]


        return vehicles


    # ========================================================
    # DETECT FROM VIDEO FRAME
    # ========================================================

    def detect_frame(
        self,
        frame: Any,
        confidence: Optional[float] = None
    ) -> Dict:

        return self.detect_with_summary(
            frame,
            confidence
        )


# ============================================================
# CREATE GLOBAL DETECTOR
# ============================================================

detector = YOLODetector()


# ============================================================
# SIMPLE HELPER FUNCTION
# ============================================================

def detect(
    image: Any,
    confidence: Optional[float] = None
) -> List[Dict]:

    return detector.detect_image(
        image,
        confidence
    )


# ============================================================
# STARTUP TEST
# ============================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print(" YOLO DETECTOR TEST")
    print("========================================")

    if detector.is_available():

        print("STATUS: YOLO ONLINE")
        print(f"MODEL: {MODEL_PATH}")

    else:

        print("STATUS: YOLO OFFLINE")
        print(f"MODEL: {MODEL_PATH}")

    print("========================================")