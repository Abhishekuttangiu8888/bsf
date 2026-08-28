import base64
import requests

IMAGE_PATH = r".\test.jpg"

with open(IMAGE_PATH, "rb") as file:
    image_bytes = file.read()

image_base64 = base64.b64encode(image_bytes).decode("utf-8")

payload = {
    "image": image_base64,
    "confidence": 0.35
}

print("Sending image to YOLO backend...")
print("Image size:", len(image_bytes), "bytes")
print("Base64 size:", len(image_base64), "characters")

response = requests.post(
    "http://127.0.0.1:8000/detect/frame",
    json=payload
)

print()
print("HTTP STATUS:", response.status_code)
print("RESPONSE:")

print(response.text)