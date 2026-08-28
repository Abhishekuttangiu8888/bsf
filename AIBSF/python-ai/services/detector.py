from ultralytics import YOLO
from collections import Counter


class YOLODetector:

    def __init__(self):
        print("Loading YOLO model...")

        self.model = YOLO("yolo26n.pt")

        print("YOLO model loaded successfully.")


    def detect(self, frame):

        results = self.model(
            frame,
            verbose=False
        )

        detections = []

        detected_objects = []


        for result in results:

            for box in result.boxes:

                class_id = int(box.cls[0])

                class_name = self.model.names[class_id]

                confidence = float(box.conf[0])

                x1, y1, x2, y2 = box.xyxy[0].tolist()


                detection = {

                    "className": class_name,

                    "confidence": round(
                        confidence,
                        4
                    ),

                    "bbox": {

                        "x1": round(x1, 2),

                        "y1": round(y1, 2),

                        "x2": round(x2, 2),

                        "y2": round(y2, 2)

                    }

                }


                detections.append(
                    detection
                )

                detected_objects.append(
                    class_name
                )


        counts = Counter(
            detected_objects
        )


        return {

            "detections": detections,

            "counts": dict(counts)

        }