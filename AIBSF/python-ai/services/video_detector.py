import cv2
from ultralytics import YOLO


class VideoDetector:

    def __init__(self):
        print("Loading YOLO video detection model...")

        self.model = YOLO("yolo26n.pt")

        print("YOLO video detection model loaded successfully.")


    def process_video(self, video_path):

        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():

            return {
                "success": False,
                "message": "Could not open video"
            }


        total_frames = 0

        detection_summary = {}

        while True:

            success, frame = cap.read()

            if not success:
                break


            total_frames += 1


            results = self.model(
                frame,
                verbose=False
            )


            for result in results:

                for box in result.boxes:

                    class_id = int(box.cls[0])

                    class_name = self.model.names[class_id]

                    confidence = float(box.conf[0])


                    if confidence < 0.6:
                        continue


                    if class_name not in detection_summary:

                        detection_summary[class_name] = 0


                    detection_summary[class_name] += 1


        cap.release()


        return {

            "success": True,

            "totalFrames": total_frames,

            "detections": detection_summary

        }