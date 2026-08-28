from ultralytics import YOLO
from collections import Counter


class YOLOVideoDetector:

    def __init__(self):

        print("Loading YOLO video detection model...")

        self.model = YOLO("yolo26n.pt")

        print("YOLO video detection model loaded successfully.")


    def detect(self, video_path):

        cap = None

        try:

            import cv2

            cap = cv2.VideoCapture(video_path)

            if not cap.isOpened():

                return {
                    "success": False,
                    "message": "Unable to open video file"
                }


            total_frames = 0

            all_detections = []

            max_objects_in_single_frame = Counter()


            while True:

                success, frame = cap.read()


                if not success:

                    break


                total_frames += 1


                results = self.model(
                    frame,
                    verbose=False
                )


                frame_objects = []


                for result in results:

                    if result.boxes is None:

                        continue


                    for box in result.boxes:

                        class_id = int(box.cls[0])

                        class_name = self.model.names[class_id]

                        confidence = float(box.conf[0])


                        frame_objects.append(
                            class_name
                        )

                        all_detections.append(
                            class_name
                        )


                frame_counts = Counter(
                    frame_objects
                )


                for object_name, count in frame_counts.items():

                    if count > max_objects_in_single_frame[object_name]:

                        max_objects_in_single_frame[
                            object_name
                        ] = count


            detection_counts = Counter(
                all_detections
            )


            return {

                "success": True,

                "totalFrames": total_frames,

                "detections": dict(
                    detection_counts
                ),

                "maxObjectsInSingleFrame": dict(
                    max_objects_in_single_frame
                )

            }


        except Exception as error:

            return {

                "success": False,

                "message": str(error)

            }


        finally:

            if cap is not None:

                cap.release()