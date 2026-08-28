import { useState } from "react";
import styles from "./LiveSurveillance.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function LiveSurveillance() {

    const { cameras, activeCameras } = useSurveillance();
    const [enlargedCamera, setEnlargedCamera] = useState(null);

    const getVideo = (cameraId) => {
        const videos = [
            "/videos/camera1.mp4",
            "/videos/camera2.mp4",
            "/videos/camera3.mp4",
            "/videos/camera4.mp4",
            "/videos/camera5.mp4",
            "/videos/camera6.mp4",
            "/videos/camera7.mp4",
            "/videos/camera8.mp4"
        ];
        return videos[(cameraId - 1) % videos.length];
    };

    const statusClass = (status) => {
        if (status === "ACTIVE") return styles.active;
        if (status === "WARNING") return styles.warning;
        return styles.offline;
    };

    return (
        <div className={styles.surveillance}>

            <div className={styles.top}>
                <div className={styles.title}>
                    <h2>LIVE SURVEILLANCE</h2>
                    <p>Real-time monitoring of border surveillance cameras</p>
                </div>

                <div className={styles.status}>
                    ● {activeCameras.length} CAMERAS ONLINE
                </div>
            </div>

            <div className={styles.cameraGrid}>

                {cameras.map((camera) => (

                    <div
                        className={styles.cameraCard}
                        key={camera.id}
                        onClick={() => setEnlargedCamera(camera)}
                    >

                        <div className={styles.video}>

                            <video
                                src={getVideo(camera.id)}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />

                            <span className={styles.live}>● LIVE</span>
                            <span className={styles.timestamp}>{camera.lastUpdate}</span>
                            <span className={styles.expandHint}>⤢ CLICK TO ENLARGE</span>

                        </div>

                        <div className={styles.cameraInfo}>

                            <div className={styles.cameraTop}>
                                <h3>📹 {camera.name.toUpperCase()}</h3>
                                <span className={statusClass(camera.status)}>
                                    ● {camera.status}
                                </span>
                            </div>

                            <p className={styles.location}>📍 {camera.location}</p>

                        </div>

                    </div>

                ))}

            </div>

            {/* ENLARGED CAMERA MODAL */}

            {enlargedCamera && (

                <div
                    className={styles.enlargeOverlay}
                    onClick={() => setEnlargedCamera(null)}
                >

                    <div
                        className={styles.enlargeModal}
                        onClick={(event) => event.stopPropagation()}
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() => setEnlargedCamera(null)}
                        >
                            ✕
                        </button>

                        <div className={styles.enlargeVideo}>

                            <video
                                key={enlargedCamera.id}
                                src={getVideo(enlargedCamera.id)}
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                            />

                            <span className={styles.live}>● LIVE</span>

                        </div>

                        <div className={styles.enlargeInfo}>

                            <div className={styles.enlargeTop}>
                                <h3>📹 {enlargedCamera.name.toUpperCase()}</h3>
                                <span className={statusClass(enlargedCamera.status)}>
                                    ● {enlargedCamera.status}
                                </span>
                            </div>

                            <p>📍 {enlargedCamera.location}</p>
                            <p className={styles.enlargeMeta}>Last update: {enlargedCamera.lastUpdate}</p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default LiveSurveillance;