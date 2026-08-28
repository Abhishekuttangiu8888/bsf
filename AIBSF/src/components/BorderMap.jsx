import { useState } from "react";
import styles from "./BorderMap.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function BorderMap() {

    const { cameras, activeCameras, activeThreats } = useSurveillance();
    const mapThreats = activeThreats.filter((threat) => threat.x && threat.y);

    const [selectedCamera, setSelectedCamera] = useState(null);
    const [liveCamera, setLiveCamera] = useState(null);

    const getVideo = (cameraId) => {
        const videos = [
            "/videos/camera1.mp4",
            "/videos/camera2.mp4",
            "/videos/camera3.mp4",
            "/videos/camera4.mp4"
        ];
        return videos[(cameraId - 1) % videos.length];
    };

    const handleViewLive = () => {
        setLiveCamera(selectedCamera);
        setSelectedCamera(null);
    };

    return (
        <div className={styles.mapPage}>

            <div className={styles.top}>
                <div>
                    <h2>BORDER MAP</h2>
                    <p>Real-time geographic overview of surveillance operations</p>
                </div>
                <div className={styles.mapStatus}>● LIVE MAP DATA</div>
            </div>

            <div className={styles.mapContainer}>

                <div className={styles.mapHeader}>
                    <div>
                        <h3>🗺️ SURVEILLANCE ZONE</h3>
                        <p>Border Sector Monitoring</p>
                    </div>
                    <div className={styles.mapControls}>
                        <button>+</button>
                        <button>−</button>
                    </div>
                </div>

                <div className={styles.map}>

                    <div className={styles.borderLine}></div>

                    <div className={`${styles.sector} ${styles.north}`}>NORTH SECTOR</div>
                    <div className={`${styles.sector} ${styles.east}`}>EAST SECTOR</div>
                    <div className={`${styles.sector} ${styles.south}`}>SOUTH SECTOR</div>
                    <div className={`${styles.sector} ${styles.west}`}>WEST SECTOR</div>

                    {cameras.map((camera) => (
                        <button
                            key={camera.id}
                            className={`${styles.cameraMarker} ${
                                camera.status === "ACTIVE" ? styles.cameraActive
                                : camera.status === "WARNING" ? styles.cameraWarning
                                : styles.cameraOffline
                            }`}
                            style={{ left: camera.x, top: camera.y }}
                            onClick={() => setSelectedCamera(camera)}
                            title={camera.name}
                        >
                            📹
                        </button>
                    ))}

                    {mapThreats.map((threat) => (
                        <div
                            key={threat.id}
                            className={threat.severity === "CRITICAL" ? styles.threatCritical : styles.threatHigh}
                            style={{ left: threat.x, top: threat.y }}
                        >
                            ⚠
                        </div>
                    ))}

                    <div className={styles.borderZone}>
                        <span>RESTRICTED BORDER ZONE</span>
                    </div>

                    <div className={styles.grid}></div>

                </div>

                <div className={styles.legend}>
                    <span><i className={styles.green}></i>Active Camera</span>
                    <span><i className={styles.yellow}></i>Warning</span>
                    <span><i className={styles.red}></i>Threat</span>
                    <span><i className={styles.gray}></i>Offline</span>
                </div>

            </div>

            <div className={styles.infoGrid}>

                <div className={styles.infoCard}>
                    <span>CAMERAS ONLINE</span>
                    <strong>{activeCameras.length}</strong>
                    <p>Active surveillance units</p>
                </div>

                <div className={styles.infoCard}>
                    <span>THREATS DETECTED</span>
                    <strong className={styles.redText}>{activeThreats.length}</strong>
                    <p>Requiring attention</p>
                </div>

                <div className={styles.infoCard}>
                    <span>BORDER COVERAGE</span>
                    <strong>87%</strong>
                    <p>Surveillance coverage</p>
                </div>

                <div className={styles.infoCard}>
                    <span>AI MONITORING</span>
                    <strong className={styles.greenText}>ONLINE</strong>
                    <p>Detection system active</p>
                </div>

            </div>

            {/* CAMERA STATUS POPUP */}

            {selectedCamera && (
                <div className={styles.cameraPanel} onClick={() => setSelectedCamera(null)}>
                    <div className={styles.cameraDetails} onClick={(event) => event.stopPropagation()}>

                        <button className={styles.closeButton} onClick={() => setSelectedCamera(null)}>✕</button>

                        <div className={styles.cameraIcon}>📹</div>
                        <h3>{selectedCamera.name}</h3>
                        <p>{selectedCamera.location}</p>

                        <div
                            className={
                                selectedCamera.status === "ACTIVE" ? styles.activeStatus
                                : selectedCamera.status === "WARNING" ? styles.warningStatus
                                : styles.offlineStatus
                            }
                        >
                            ● {selectedCamera.status}
                        </div>

                        <button className={styles.viewButton} onClick={handleViewLive}>
                            VIEW LIVE CAMERA
                        </button>

                    </div>
                </div>
            )}

            {/* LIVE VIDEO FEED — stays on this page, no navigation */}

            {liveCamera && (
                <div className={styles.livePanel} onClick={() => setLiveCamera(null)}>
                    <div className={styles.liveModal} onClick={(event) => event.stopPropagation()}>

                        <button className={styles.closeButton} onClick={() => setLiveCamera(null)}>✕</button>

                        <div className={styles.liveVideo}>
                            <video
                                key={liveCamera.id}
                                src={getVideo(liveCamera.id)}
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                            />
                            <span className={styles.liveTag}>● LIVE</span>
                        </div>

                        <div className={styles.liveInfo}>
                            <h3>{liveCamera.name}</h3>
                            <p>📍 {liveCamera.location}</p>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default BorderMap;