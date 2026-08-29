import { useState } from "react";

import styles from "./ThreatDetection.module.css";

import {
    useSurveillance
} from "../context/SurveillanceContext";


function ThreatDetection() {

    const {
        threats,
        criticalThreats,
        highThreats,
        mediumThreats,
        viewCameraLive
    } = useSurveillance();


    const [
        selectedThreat,
        setSelectedThreat
    ] = useState(null);


    /*
    ============================================================
    VIEW CAMERA
    ============================================================

    Opens the Cameras / Live Surveillance page and
    automatically selects the camera related to the threat.
    */

    const handleViewCamera = () => {

        if (!selectedThreat) {
            return;
        }


        if (
            selectedThreat.cameraId === undefined ||
            selectedThreat.cameraId === null
        ) {

            console.warn(
                "Camera ID not available for this threat"
            );

            return;

        }


        /*
        Close the threat modal first.
        */

        setSelectedThreat(null);


        /*
        Open the related camera.
        */

        viewCameraLive(
            selectedThreat.cameraId
        );

    };


    return (

        <div
            className={
                styles.threatDetection
            }
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className={
                    styles.top
                }
            >

                <div>

                    <h2>
                        THREAT DETECTION
                    </h2>

                    <p>
                        AI-powered real-time threat monitoring and analysis
                    </p>

                </div>


                <div
                    className={
                        styles.status
                    }
                >

                    ● AI MONITORING ACTIVE

                </div>

            </div>


            {/* ==================================================
                LIVE STATISTICS
            ================================================== */}

            <div
                className={
                    styles.stats
                }
            >

                <div
                    className={
                        styles.statCard
                    }
                >

                    <p>
                        TOTAL THREATS
                    </p>

                    <h3>
                        {threats.length}
                    </h3>

                    <span>
                        Detected by AI
                    </span>

                </div>


                <div
                    className={
                        styles.statCard
                    }
                >

                    <p>
                        CRITICAL
                    </p>

                    <h3
                        className={
                            styles.critical
                        }
                    >
                        {criticalThreats.length}
                    </h3>

                    <span>
                        Immediate action required
                    </span>

                </div>


                <div
                    className={
                        styles.statCard
                    }
                >

                    <p>
                        HIGH PRIORITY
                    </p>

                    <h3
                        className={
                            styles.high
                        }
                    >
                        {highThreats.length}
                    </h3>

                    <span>
                        Requires attention
                    </span>

                </div>


                <div
                    className={
                        styles.statCard
                    }
                >

                    <p>
                        MEDIUM
                    </p>

                    <h3
                        className={
                            styles.medium
                        }
                    >
                        {mediumThreats.length}
                    </h3>

                    <span>
                        Under monitoring
                    </span>

                </div>

            </div>


            {/* ==================================================
                MAIN GRID
            ================================================== */}

            <div
                className={
                    styles.mainGrid
                }
            >

                {/* ==================================================
                    AI ANALYSIS
                ================================================== */}

                <div
                    className={
                        styles.analysis
                    }
                >

                    <div
                        className={
                            styles.sectionHeader
                        }
                    >

                        <div>

                            <h3>
                                🤖 AI ANALYSIS ENGINE
                            </h3>

                            <p>
                                Real-time computer vision analysis
                            </p>

                        </div>


                        <span
                            className={
                                styles.online
                            }
                        >

                            ● ONLINE

                        </span>

                    </div>


                    <div
                        className={
                            styles.analysisBox
                        }
                    >

                        <div
                            className={
                                styles.scanCircle
                            }
                        >

                            AI

                        </div>


                        <div
                            className={
                                styles.analysisText
                            }
                        >

                            <h4>
                                SCANNING SURVEILLANCE FEEDS
                            </h4>

                            <p>
                                AI models are continuously analyzing
                                camera feeds for suspicious activity.
                            </p>


                            <div
                                className={
                                    styles.progress
                                }
                            >

                                <div></div>

                            </div>


                            <span>
                                Real-time YOLO detection active
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    RECENT DETECTIONS
                ================================================== */}

                <div
                    className={
                        styles.recent
                    }
                >

                    <div
                        className={
                            styles.sectionHeader
                        }
                    >

                        <div>

                            <h3>
                                🚨 RECENT DETECTIONS
                            </h3>

                            <p>
                                Latest AI-generated alerts
                            </p>

                        </div>

                    </div>


                    <div
                        className={
                            styles.threatList
                        }
                    >

                        {threats.length === 0 ? (

                            <div
                                style={{
                                    padding:
                                        "30px 10px",

                                    textAlign:
                                        "center",

                                    color:
                                        "var(--text-muted)",

                                    fontSize:
                                        "11px"
                                }}
                            >

                                ● WAITING FOR AI THREAT DETECTIONS...

                            </div>

                        ) : (

                            threats.map(
                                threat => (

                                    <div
                                        className={
                                            styles.threatItem
                                        }

                                        key={
                                            threat.id
                                        }

                                        onClick={() =>
                                            setSelectedThreat(
                                                threat
                                            )
                                        }
                                    >

                                        <div
                                            className={
                                                styles.threatIcon
                                            }
                                        >

                                            {
                                                threat.icon
                                            }

                                        </div>


                                        <div
                                            className={
                                                styles.threatInfo
                                            }
                                        >

                                            <h4>
                                                {
                                                    threat.title
                                                }
                                            </h4>


                                            <p>

                                                {
                                                    threat.camera
                                                }

                                                {" • "}

                                                {
                                                    threat.location
                                                }

                                            </p>

                                        </div>


                                        <span
                                            className={

                                                threat.severity ===
                                                "CRITICAL"

                                                    ? styles.criticalBadge

                                                    : threat.severity ===
                                                      "HIGH"

                                                        ? styles.highBadge

                                                        : styles.mediumBadge

                                            }
                                        >

                                            {
                                                threat.severity
                                            }

                                        </span>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            </div>


            {/* ==================================================
                THREAT DETAILS MODAL
            ================================================== */}

            {selectedThreat && (

                <div
                    className={
                        styles.modalOverlay
                    }

                    onClick={() =>
                        setSelectedThreat(
                            null
                        )
                    }
                >

                    <div
                        className={
                            styles.modal
                        }

                        onClick={
                            event =>
                                event.stopPropagation()
                        }
                    >

                        {/* ==================================================
                            MODAL HEADER
                        ================================================== */}

                        <div
                            className={
                                styles.modalHeader
                            }
                        >

                            <div>

                                <h3>
                                    THREAT DETAILS
                                </h3>

                                <p>
                                    AI detection information
                                </p>

                            </div>


                            <button
                                className={
                                    styles.closeButton
                                }

                                onClick={() =>
                                    setSelectedThreat(
                                        null
                                    )
                                }
                            >

                                ✕

                            </button>

                        </div>


                        {/* ==================================================
                            THREAT TITLE
                        ================================================== */}

                        <div
                            className={
                                styles.modalTitle
                            }
                        >

                            <div
                                className={
                                    styles.modalIcon
                                }
                            >

                                {
                                    selectedThreat.icon
                                }

                            </div>


                            <div>

                                <h2>
                                    {
                                        selectedThreat.title
                                    }
                                </h2>


                                <span
                                    className={

                                        selectedThreat.severity ===
                                        "CRITICAL"

                                            ? styles.criticalText

                                            : selectedThreat.severity ===
                                              "HIGH"

                                                ? styles.highText

                                                : styles.mediumText

                                    }
                                >

                                    ●{" "}

                                    {
                                        selectedThreat.severity
                                    }

                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            THREAT DETAILS
                        ================================================== */}

                        <div
                            className={
                                styles.detailsGrid
                            }
                        >

                            <div>

                                <span>
                                    CAMERA
                                </span>

                                <strong>
                                    {
                                        selectedThreat.camera
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    {
                                        selectedThreat.location
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CONFIDENCE
                                </span>

                                <strong>
                                    {
                                        selectedThreat.confidence
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    DETECTED AT
                                </span>

                                <strong>
                                    {
                                        selectedThreat.time
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    STATUS
                                </span>

                                <strong>
                                    {
                                        selectedThreat.investigationStatus
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div
                            className={
                                styles.modalActions
                            }
                        >

                            <button
                                className={
                                    styles.cameraButton
                                }

                                onClick={
                                    handleViewCamera
                                }
                            >

                                📹 VIEW CAMERA

                            </button>


                            <button
                                className={
                                    styles.dismissButton
                                }

                                onClick={() =>
                                    setSelectedThreat(
                                        null
                                    )
                                }
                            >

                                DISMISS

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default ThreatDetection;