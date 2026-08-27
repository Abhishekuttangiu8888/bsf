import { useState } from "react";
import styles from "./ThreatDetection.module.css";

function ThreatDetection() {

    const [selectedThreat, setSelectedThreat] = useState(null);

    const threats = [
        {
            id: 1,
            type: "Unauthorized Movement",
            camera: "Camera 03",
            location: "East Border Sector",
            severity: "CRITICAL",
            confidence: "94.7%",
            time: "12:45:32",
            status: "INVESTIGATING",
            icon: "⚠"
        },
        {
            id: 2,
            type: "Suspicious Vehicle",
            camera: "Camera 07",
            location: "North Border Sector",
            severity: "HIGH",
            confidence: "89.3%",
            time: "12:42:18",
            status: "MONITORING",
            icon: "🚗"
        },
        {
            id: 3,
            type: "Unknown Person Detected",
            camera: "Camera 12",
            location: "West Border Sector",
            severity: "MEDIUM",
            confidence: "82.6%",
            time: "12:38:45",
            status: "MONITORING",
            icon: "👤"
        },
        {
            id: 4,
            type: "Object Left Behind",
            camera: "Camera 09",
            location: "South Border Sector",
            severity: "MEDIUM",
            confidence: "78.9%",
            time: "12:34:21",
            status: "MONITORING",
            icon: "📦"
        }
    ];


    return (
        <div className={styles.threatDetection}>

            {/* TOP */}

            <div className={styles.top}>

                <div>
                    <h2>THREAT DETECTION</h2>

                    <p>
                        AI-powered real-time threat monitoring and analysis
                    </p>
                </div>

                <div className={styles.status}>
                    ● AI MONITORING ACTIVE
                </div>

            </div>


            {/* STATISTICS */}

            <div className={styles.stats}>

                <div className={styles.statCard}>
                    <p>TOTAL THREATS</p>
                    <h3>{threats.length}</h3>
                    <span>Detected today</span>
                </div>


                <div className={styles.statCard}>
                    <p>CRITICAL</p>

                    <h3 className={styles.critical}>
                        {
                            threats.filter(
                                threat => threat.severity === "CRITICAL"
                            ).length
                        }
                    </h3>

                    <span>Immediate action required</span>
                </div>


                <div className={styles.statCard}>
                    <p>HIGH PRIORITY</p>

                    <h3 className={styles.high}>
                        {
                            threats.filter(
                                threat => threat.severity === "HIGH"
                            ).length
                        }
                    </h3>

                    <span>Requires attention</span>
                </div>


                <div className={styles.statCard}>
                    <p>MEDIUM</p>

                    <h3 className={styles.medium}>
                        {
                            threats.filter(
                                threat => threat.severity === "MEDIUM"
                            ).length
                        }
                    </h3>

                    <span>Under monitoring</span>
                </div>

            </div>


            {/* MAIN GRID */}

            <div className={styles.mainGrid}>

                {/* AI ANALYSIS */}

                <div className={styles.analysis}>

                    <div className={styles.sectionHeader}>

                        <div>
                            <h3>🤖 AI ANALYSIS ENGINE</h3>

                            <p>
                                Real-time computer vision analysis
                            </p>
                        </div>

                        <span className={styles.online}>
                            ● ONLINE
                        </span>

                    </div>


                    <div className={styles.analysisBox}>

                        <div className={styles.scanCircle}>
                            AI
                        </div>

                        <div className={styles.analysisText}>

                            <h4>
                                SCANNING SURVEILLANCE FEEDS
                            </h4>

                            <p>
                                AI models are continuously analyzing
                                camera feeds for suspicious activity.
                            </p>

                            <div className={styles.progress}>
                                <div></div>
                            </div>

                            <span>
                                Processing 21 active camera feeds
                            </span>

                        </div>

                    </div>

                </div>


                {/* RECENT THREATS */}

                <div className={styles.recent}>

                    <div className={styles.sectionHeader}>

                        <div>
                            <h3>🚨 RECENT DETECTIONS</h3>

                            <p>
                                Latest AI-generated alerts
                            </p>
                        </div>

                    </div>


                    <div className={styles.threatList}>

                        {
                            threats.map((threat) => (

                                <div
                                    className={styles.threatItem}
                                    key={threat.id}
                                    onClick={() => setSelectedThreat(threat)}
                                >

                                    <div className={styles.threatIcon}>
                                        {threat.icon}
                                    </div>


                                    <div className={styles.threatInfo}>

                                        <h4>
                                            {threat.type}
                                        </h4>

                                        <p>
                                            {threat.camera} • {threat.location}
                                        </p>

                                    </div>


                                    <span
                                        className={
                                            threat.severity === "CRITICAL"
                                                ? styles.criticalBadge
                                                : threat.severity === "HIGH"
                                                    ? styles.highBadge
                                                    : styles.mediumBadge
                                        }
                                    >
                                        {threat.severity}
                                    </span>

                                </div>

                            ))
                        }

                    </div>

                </div>

            </div>


            {/* THREAT DETAILS MODAL */}

            {
                selectedThreat && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSelectedThreat(null)}
                    >

                        <div
                            className={styles.modal}
                            onClick={(event) => event.stopPropagation()}
                        >

                            {/* MODAL HEADER */}

                            <div className={styles.modalHeader}>

                                <div>
                                    <h3>THREAT DETAILS</h3>

                                    <p>
                                        AI detection information
                                    </p>
                                </div>

                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedThreat(null)}
                                >
                                    ✕
                                </button>

                            </div>


                            {/* THREAT TITLE */}

                            <div className={styles.modalTitle}>

                                <div className={styles.modalIcon}>
                                    {selectedThreat.icon}
                                </div>

                                <div>
                                    <h2>
                                        {selectedThreat.type}
                                    </h2>

                                    <span
                                        className={
                                            selectedThreat.severity === "CRITICAL"
                                                ? styles.criticalText
                                                : selectedThreat.severity === "HIGH"
                                                    ? styles.highText
                                                    : styles.mediumText
                                        }
                                    >
                                        ● {selectedThreat.severity}
                                    </span>
                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className={styles.detailsGrid}>

                                <div>
                                    <span>CAMERA</span>
                                    <strong>{selectedThreat.camera}</strong>
                                </div>

                                <div>
                                    <span>LOCATION</span>
                                    <strong>{selectedThreat.location}</strong>
                                </div>

                                <div>
                                    <span>CONFIDENCE</span>
                                    <strong>{selectedThreat.confidence}</strong>
                                </div>

                                <div>
                                    <span>DETECTED AT</span>
                                    <strong>{selectedThreat.time}</strong>
                                </div>

                                <div>
                                    <span>STATUS</span>
                                    <strong>{selectedThreat.status}</strong>
                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className={styles.modalActions}>

                                <button className={styles.cameraButton}>
                                    📹 VIEW CAMERA
                                </button>

                                <button
                                    className={styles.dismissButton}
                                    onClick={() => setSelectedThreat(null)}
                                >
                                    DISMISS
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>
    );
}

export default ThreatDetection;