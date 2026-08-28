import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function useYOLODetection(videoRef, options = {}) {

    const {
        enabled = true,
        interval = 1000,
        confidence = 0.35,
        cameraId = null,
        cameraName = "Unknown Camera",
        location = "Unknown Location"
    } = options;

    const [detections, setDetections] = useState([]);
    const [threat, setThreat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const canvasRef = useRef(null);
    const timerRef = useRef(null);
    const busyRef = useRef(false);

    useEffect(() => {

        if (!enabled) {
            return;
        }

        const video = videoRef?.current;

        if (!video) {
            return;
        }

        // Create hidden canvas
        const canvas = document.createElement("canvas");

        canvasRef.current = canvas;

        const captureFrame = async () => {

            if (busyRef.current) {
                return;
            }

            if (!video) {
                return;
            }

            if (
                video.readyState < 2 ||
                video.videoWidth === 0 ||
                video.videoHeight === 0
            ) {
                return;
            }

            busyRef.current = true;
            setLoading(true);

            try {

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const context = canvas.getContext("2d");

                context.drawImage(
                    video,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                // Convert frame to JPEG
                const dataUrl = canvas.toDataURL(
                    "image/jpeg",
                    0.8
                );

                // Send Base64 without data URL prefix
                const base64Image = dataUrl.split(",")[1];

                const response = await fetch(
                    `${API_URL}/detect/frame`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            image: base64Image,
                            confidence: confidence,
                            cameraId: cameraId,
                            cameraName: cameraName,
                            location: location
                        })
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        `Backend returned ${response.status}`
                    );
                }

                const data = await response.json();

                setDetections(
                    data.detections || []
                );

                setThreat(
                    data.threat || null
                );

                setError(null);

            } catch (err) {

                console.error(
                    "YOLO detection error:",
                    err
                );

                setError(
                    err.message
                );

            } finally {

                setLoading(false);
                busyRef.current = false;
            }
        };

        timerRef.current = setInterval(
            captureFrame,
            interval
        );

        // Initial detection
        captureFrame();

        return () => {

            if (timerRef.current) {

                clearInterval(
                    timerRef.current
                );

                timerRef.current = null;
            }

            busyRef.current = false;
        };

    }, [
        videoRef,
        enabled,
        interval,
        confidence,
        cameraId,
        cameraName,
        location
    ]);

    return {
        detections,
        threat,
        loading,
        error
    };
}

export default useYOLODetection;