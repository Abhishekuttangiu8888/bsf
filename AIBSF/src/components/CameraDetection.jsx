import { useRef } from "react";
import useYOLODetection from "../hooks/useYOLODetection";

function CameraDetection({
    camera,
    videoSrc
}) {

    const videoRef = useRef(null);

    const {
        detections,
        threat,
        loading,
        error
    } = useYOLODetection(
        videoRef,
        {
            enabled: true,
            interval: 1000,
            confidence: 0.35,
            cameraId: camera.id,
            cameraName: camera.name,
            location: camera.location
        }
    );

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%"
            }}
        >

            <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}
            />

            {/* YOLO STATUS */}

            <div
                style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "5px 9px",
                    background: "rgba(0,0,0,0.75)",
                    color: "#00ff88",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "bold"
                }}
            >
                {loading ? "AI SCANNING" : "AI ONLINE"}
            </div>

            {/* DETECTION COUNT */}

            {detections.length > 0 && (

                <div
                    style={{
                        position: "absolute",
                        left: "12px",
                        bottom: "12px",
                        padding: "6px 10px",
                        background: "rgba(0,0,0,0.75)",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "bold"
                    }}
                >
                    DETECTED: {detections.length}
                </div>

            )}

            {/* THREAT */}

            {threat?.alertRequired && (

                <div
                    style={{
                        position: "absolute",
                        top: "45px",
                        left: "12px",
                        padding: "6px 10px",
                        background: "rgba(120,0,0,0.85)",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "bold"
                    }}
                >
                    ⚠ {threat.threatLevel} THREAT
                </div>

            )}

            {/* ERROR */}

            {error && (

                <div
                    style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        padding: "5px 8px",
                        background: "rgba(120,0,0,0.8)",
                        color: "#ffffff",
                        borderRadius: "4px",
                        fontSize: "9px"
                    }}
                >
                    AI ERROR
                </div>

            )}

        </div>
    );
}

export default CameraDetection;