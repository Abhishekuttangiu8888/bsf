import { useState } from "react";
import styles from "./BorderMap.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function BorderMap() {
    const {
        cameras,
        activeCameras,
        activeThreats
    } = useSurveillance();

    const [selectedCamera, setSelectedCamera] = useState(null);
    const [liveCamera, setLiveCamera] = useState(null);

    /*
    ============================================================
    CHECK WHETHER CAMERA HAS AN ACTIVE THREAT
    ============================================================
    */

    const cameraHasThreat = (cameraId) => {
        return activeThreats.some(
            (threat) =>
                Number(threat.cameraId) === Number(cameraId) &&
                threat.status === "ACTIVE"
        );
    };

    /*
    ============================================================
    GET THREAT POSITION
    ============================================================
    */

    const getThreatPosition = (threat) => {
        const camera = cameras.find(
            (cam) =>
                Number(cam.id) === Number(threat.cameraId)
        );

        if (!camera) {
            return {
                left: "50%",
                top: "50%"
            };
        }

        return {
            left: camera.x,
            top: camera.y
        };
    };

    /*
    ============================================================
    CAMERA VIDEO
    ============================================================
    */

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

        const index =
            (Number(cameraId) - 1) % videos.length;

        return videos[index];
    };

    /*
    ============================================================
    VIEW LIVE CAMERA
    ============================================================
    */

    const handleViewLive = () => {
        if (!selectedCamera) {
            return;
        }

        setLiveCamera(selectedCamera);
        setSelectedCamera(null);
    };

    /*
    ============================================================
    THREAT SEVERITY CLASS
    ============================================================
    */

    const getThreatClass = (severity) => {
        if (severity === "CRITICAL") {
            return styles.threatCritical;
        }

        if (severity === "HIGH") {
            return styles.threatHigh;
        }

        return styles.threatMedium;
    };

    return (
        <div className={styles.mapPage}>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className={styles.top}>

                <div>
                    <h2>BORDER MAP</h2>

                    <p>
                        Real-time geographic overview of
                        surveillance operations
                    </p>
                </div>

                <div className={styles.mapStatus}>
                    ● LIVE MAP DATA
                </div>

            </div>


            {/* ==================================================
                MAP CONTAINER
            ================================================== */}

            <div className={styles.mapContainer}>

                <div className={styles.mapHeader}>

                    <div>
                        <h3>
                            🗺️ SURVEILLANCE ZONE
                        </h3>

                        <p>
                            Border Sector Monitoring
                        </p>
                    </div>

                    <div className={styles.mapControls}>
                        <button>+</button>
                        <button>−</button>
                    </div>

                </div>


                {/* ==================================================
                    MAP
                ================================================== */}

                <div className={styles.map}>

                    {/* BORDER LINE */}

                    <div className={styles.borderLine}></div>


                    {/* SECTORS */}

                    <div
                        className={`${styles.sector} ${styles.north}`}
                    >
                        NORTH SECTOR
                    </div>

                    <div
                        className={`${styles.sector} ${styles.east}`}
                    >
                        EAST SECTOR
                    </div>

                    <div
                        className={`${styles.sector} ${styles.south}`}
                    >
                        SOUTH SECTOR
                    </div>

                    <div
                        className={`${styles.sector} ${styles.west}`}
                    >
                        WEST SECTOR
                    </div>


                    {/* ==================================================
                        CAMERA MARKERS
                    ================================================== */}

                    {cameras.map((camera) => {

                        const hasThreat =
                            cameraHasThreat(camera.id);

                        let cameraClass;

                        /*
                        IMPORTANT:

                        Threat gets FIRST priority.

                        ACTIVE + THREAT
                            -> RED

                        ACTIVE + NO THREAT
                            -> GREEN

                        WARNING + NO THREAT
                            -> YELLOW

                        OFFLINE
                            -> GRAY
                        */

                        if (hasThreat) {
                            cameraClass =
                                styles.cameraThreat;
                        }
                        else if (
                            camera.status === "ACTIVE"
                        ) {
                            cameraClass =
                                styles.cameraActive;
                        }
                        else if (
                            camera.status === "WARNING"
                        ) {
                            cameraClass =
                                styles.cameraWarning;
                        }
                        else {
                            cameraClass =
                                styles.cameraOffline;
                        }

                        return (
                            <button
                                key={camera.id}
                                className={`${styles.cameraMarker} ${cameraClass}`}
                                style={{
                                    left: camera.x,
                                    top: camera.y
                                }}
                                onClick={() =>
                                    setSelectedCamera(camera)
                                }
                                title={
                                    hasThreat
                                        ? `${camera.name} - ACTIVE THREAT`
                                        : `${camera.name} - ${camera.status}`
                                }
                            >
                                📹
                            </button>
                        );
                    })}


                    {/* ==================================================
                        ACTIVE THREAT MARKERS
                    ================================================== */}

                    {activeThreats.map((threat) => {

                        const position =
                            getThreatPosition(threat);

                        return (
                            <div
                                key={`threat-${threat.id}`}
                                className={getThreatClass(
                                    threat.severity
                                )}
                                style={{
                                    left: position.left,
                                    top: position.top
                                }}
                                title={`${threat.title} - ${threat.severity}`}
                            >
                                ⚠
                            </div>
                        );
                    })}


                    {/* ==================================================
                        RESTRICTED BORDER ZONE
                    ================================================== */}

                    <div className={styles.borderZone}>
                        <span>
                            RESTRICTED BORDER ZONE
                        </span>
                    </div>


                    {/* ==================================================
                        GRID
                    ================================================== */}

                    <div className={styles.grid}></div>

                </div>


                {/* ==================================================
                    LEGEND
                ================================================== */}

                <div className={styles.legend}>

                    <span>
                        <i className={styles.green}></i>
                        Active Camera
                    </span>

                    <span>
                        <i className={styles.yellow}></i>
                        Warning
                    </span>

                    <span>
                        <i className={styles.red}></i>
                        Threat
                    </span>

                    <span>
                        <i className={styles.gray}></i>
                        Offline
                    </span>

                </div>

            </div>


            {/* ==================================================
                INFORMATION CARDS
            ================================================== */}

            <div className={styles.infoGrid}>

                <div className={styles.infoCard}>
                    <span>CAMERAS ONLINE</span>

                    <strong>
                        {activeCameras.length}
                    </strong>

                    <p>
                        Active surveillance units
                    </p>
                </div>


                <div className={styles.infoCard}>
                    <span>THREATS DETECTED</span>

                    <strong className={styles.redText}>
                        {activeThreats.length}
                    </strong>

                    <p>
                        Requiring attention
                    </p>
                </div>


                <div className={styles.infoCard}>
                    <span>BORDER COVERAGE</span>

                    <strong>
                        87%
                    </strong>

                    <p>
                        Surveillance coverage
                    </p>
                </div>


                <div className={styles.infoCard}>
                    <span>AI MONITORING</span>

                    <strong className={styles.greenText}>
                        ONLINE
                    </strong>

                    <p>
                        Detection system active
                    </p>
                </div>

            </div>


            {/* ==================================================
                CAMERA STATUS POPUP
            ================================================== */}

            {selectedCamera && (

                <div
                    className={styles.cameraPanel}
                    onClick={() =>
                        setSelectedCamera(null)
                    }
                >

                    <div
                        className={styles.cameraDetails}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() =>
                                setSelectedCamera(null)
                            }
                        >
                            ✕
                        </button>


                        <div className={styles.cameraIcon}>
                            📹
                        </div>


                        <h3>
                            {selectedCamera.name}
                        </h3>


                        <p>
                            {selectedCamera.location}
                        </p>


                        {/* CAMERA STATUS */}

                        <div
                            className={
                                cameraHasThreat(
                                    selectedCamera.id
                                )
                                    ? styles.threatStatus
                                    : selectedCamera.status === "ACTIVE"
                                        ? styles.activeStatus
                                        : selectedCamera.status === "WARNING"
                                            ? styles.warningStatus
                                            : styles.offlineStatus
                            }
                        >

                            ●{" "}

                            {cameraHasThreat(
                                selectedCamera.id
                            )
                                ? "THREAT DETECTED"
                                : selectedCamera.status}

                        </div>


                        <button
                            className={styles.viewButton}
                            onClick={handleViewLive}
                        >
                            VIEW LIVE CAMERA
                        </button>

                    </div>

                </div>

            )}


            {/* ==================================================
                LIVE VIDEO PANEL
            ================================================== */}

            {liveCamera && (

                <div
                    className={styles.livePanel}
                    onClick={() =>
                        setLiveCamera(null)
                    }
                >

                    <div
                        className={styles.liveModal}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() =>
                                setLiveCamera(null)
                            }
                        >
                            ✕
                        </button>


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

                            <span className={styles.liveTag}>
                                ● LIVE
                            </span>

                        </div>


                        <div className={styles.liveInfo}>

                            <h3>
                                {liveCamera.name}
                            </h3>

                            <p>
                                📍 {liveCamera.location}
                            </p>

                            <p>
                                Status:{" "}

                                {cameraHasThreat(
                                    liveCamera.id
                                )
                                    ? "THREAT DETECTED"
                                    : liveCamera.status}

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default BorderMap;