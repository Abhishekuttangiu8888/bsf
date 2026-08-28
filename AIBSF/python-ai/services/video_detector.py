from ultralytics import YOLO
import cv2
from collections import Counter


class YOLOVideoDetector:

    def __init__(self):

        print("Loading YOLO video detection model...")

        self.model = YOLO("yolo26n.pt")

        print("YOLO video detection model loaded successfully.")


    def detect_video(self, video_path):

        video = cv2.VideoCapture(video_path)

        # Total detections across the complete video
        detected_objects = []

        # Stores the highest number of each object
        # visible at the same time in a single frame
        max_objects_in_frame = {}

        total_frames = 0


        while True:

            success, frame = video.read()

            if not success:
                break


            total_frames += 1


            # Run YOLO detection

            results = self.model(
                frame,
                verbose=False
            )


            # Count objects in the CURRENT frame

            frame_objects = []


            for result in results:

                for box in result.boxes:

                    class_id = int(
                        box.cls[0]
                    )

                    class_name = self.model.names[
                        class_id
                    ]


                    # Save to total video detections

                    detected_objects.append(
                        class_name
                    )


                    # Save to current frame detections

                    frame_objects.append(
                        class_name
                    )


            # Count objects in this frame

            frame_counts = Counter(
                frame_objects
            )


            # Update maximum objects visible
            # at the same time

            for class_name, count in frame_counts.items():

                current_max = (
                    max_objects_in_frame.get(
                        class_name,
                        0
                    )
                )


                if count > current_max:

                    max_objects_in_frame[
                        class_name
                    ] = count


        # Release video

        video.release()


        # Count total detections
        # across all frames

        total_counts = Counter(
            detected_objects
        )


        return {

            "totalFrames": total_frames,

            # Total detections across the video
            # Useful for analytics

            "detections":
                dict(total_counts),


            # Maximum number of objects
            # visible simultaneously

            "maxObjectsInSingleFrame":
                max_objects_in_frame

        }