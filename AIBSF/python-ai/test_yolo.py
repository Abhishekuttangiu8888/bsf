from ultralytics import YOLO
import cv2
from collections import Counter

# Load YOLO model
model = YOLO("yolo26n.pt")

# Video path
video_path = "test.mp4"

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

while True:
    success, frame = cap.read()

    if not success:
        break

    # Run YOLO
    results = model(frame, verbose=False)

    # Count detected objects
    detected_objects = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])

            detected_objects.append(class_name)

            print(
                f"Detected: {class_name} | "
                f"Confidence: {confidence * 100:.1f}%"
            )

    # Count each object type
    counts = Counter(detected_objects)

    # Show important summary
    if counts:
        print("\n--- DETECTION SUMMARY ---")

        for object_name, count in counts.items():
            print(f"{object_name}: {count}")

        print("-------------------------\n")

    # Draw bounding boxes
    annotated_frame = results[0].plot()

    # Show video
    cv2.imshow("BSF AI Surveillance", annotated_frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()