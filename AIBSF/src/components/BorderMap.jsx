import { useState } from "react";
import styles from "./BorderMap.module.css";

function BorderMap() {

    const [selectedCamera, setSelectedCamera] = useState(null);

    const cameras = [
        {
            id: 1,
            name: "Camera 01",
            sector: "North Border",
            status: "ACTIVE",
            x: "20%",
            y: "25%"
        },
        {
            id: 2,
            name: "Camera 02",
            sector: "South Border",
            status: "ACTIVE",
            x: "35%",
            y: "72%"
        },
        {
            id: 3,
            name: "Camera 03",
            sector: "East Border",
            status: "WARNING",
            x: "78%",
            y: "35%"
        },
        {
            id: 4,
            name: "Camera 04",
            sector: "West Border",
            status: "OFFLINE",
            x: "18%",
            y: "55%"
        },
        {
            id: 5,
            name: "Camera 05",
            sector: "North-East Border",
            status: "ACTIVE",
            x: "62%",
            y: "20%"
        },
        {
            id: 6,
            name: "Camera 06",
            sector: "South-East Border",
            status: "ACTIVE",
            x: "70%",
            y: "75%"
        }
    ];


    const threats = [
        {
            id: 1,
            name: "Unauthorized Movement",
            severity: "CRITICAL",
            x: "58%",
            y: "45%"
        },
        {
            id: 2,
            name: "Suspicious Vehicle",
            severity: "HIGH",
            x: "72%",
            y: "55%"
        }
    ];


    return (
        <div className={styles.mapPage}>

            {/* ================= TOP ================= */}

            <div className={styles.top}>

                <div>

                    <h2>BORDER MAP</h2>

                    <p>
                        Real-time geographic overview of surveillance operations
                    </p>

                </div>


                <div className={styles.mapStatus}>
                    ● LIVE MAP DATA
                </div>

            </div>


            {/* ================= MAP AREA ================= */}

            <div className={styles.mapContainer}>

                {/* MAP HEADER */}

                <div className={styles.mapHeader}>

                    <div>
                        <h3>🗺️ SURVEILLANCE ZONE</h3>

                        <p>
                            Border Sector Monitoring
                        </p>
                    </div>


                    <div className={styles.mapControls}>

                        <button>+</button>

                        <button>−</button>

                    </div>

                </div>


                {/* MAP */}

                <div className={styles.map}>

                    <div className={styles.borderLine}></div>


                    {/* SECTORS */}

                    <div className={`${styles.sector} ${styles.north}`}>
                        NORTH SECTOR
                    </div>

                    <div className={`${styles.sector} ${styles.east}`}>
                        EAST SECTOR
                    </div>

                    <div className={`${styles.sector} ${styles.south}`}>
                        SOUTH SECTOR
                    </div>

                    <div className={`${styles.sector} ${styles.west}`}>
                        WEST SECTOR
                    </div>


                    {/* CAMERA MARKERS */}

                    {
                        cameras.map((camera) => (

                            <button
                                key={camera.id}
                                className={`${styles.cameraMarker} ${
                                    camera.status === "ACTIVE"
                                        ? styles.cameraActive
                                        : camera.status === "WARNING"
                                            ? styles.cameraWarning
                                            : styles.cameraOffline
                                }`}
                                style={{
                                    left: camera.x,
                                    top: camera.y
                                }}
                                onClick={() =>
                                    setSelectedCamera(camera)
                                }
                                title={camera.name}
                            >
                                📹
                            </button>

                        ))
                    }


                    {/* THREAT MARKERS */}

                    {
                        threats.map((threat) => (

                            <div
                                key={threat.id}
                                className={
                                    threat.severity === "CRITICAL"
                                        ? styles.threatCritical
                                        : styles.threatHigh
                                }
                                style={{
                                    left: threat.x,
                                    top: threat.y
                                }}
                            >
                                ⚠
                            </div>

                        ))
                    }


                    {/* CENTER BORDER */}

                    <div className={styles.borderZone}>

                        <span>
                            RESTRICTED BORDER ZONE
                        </span>

                    </div>


                    {/* MAP GRID */}

                    <div className={styles.grid}></div>

                </div>


                {/* MAP LEGEND */}

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


            {/* ================= BOTTOM INFORMATION ================= */}

            <div className={styles.infoGrid}>

                <div className={styles.infoCard}>

                    <span>CAMERAS ONLINE</span>

                    <strong>21</strong>

                    <p>
                        Active surveillance units
                    </p>

                </div>


                <div className={styles.infoCard}>

                    <span>THREATS DETECTED</span>

                    <strong className={styles.redText}>
                        3
                    </strong>

                    <p>
                        Requiring attention
                    </p>

                </div>


                <div className={styles.infoCard}>

                    <span>BORDER COVERAGE</span>

                    <strong>87%</strong>

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


            {/* ================= CAMERA DETAILS ================= */}

            {
                selectedCamera && (

                    <div
                        className={styles.cameraPanel}
                        onClick={() => setSelectedCamera(null)}
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
                                {selectedCamera.sector}
                            </p>


                            <div
                                className={
                                    selectedCamera.status === "ACTIVE"
                                        ? styles.activeStatus
                                        : selectedCamera.status === "WARNING"
                                            ? styles.warningStatus
                                            : styles.offlineStatus
                                }
                            >
                                ● {selectedCamera.status}
                            </div>


                            <button className={styles.viewButton}>
                                VIEW LIVE CAMERA
                            </button>

                        </div>

                    </div>

                )
            }

        </div>
    );
}

export default BorderMap;