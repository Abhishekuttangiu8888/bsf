import { useState } from "react";
import styles from "./Incidents.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function Incidents() {
    const { incidents } = useSurveillance();

    const [selectedIncident, setSelectedIncident] = useState(null);

    const activeIncidents = incidents.filter(
        (incident) => incident.status === "ACTIVE"
    );

    const criticalIncidents = incidents.filter(
        (incident) => incident.severity === "CRITICAL"
    );

    const highIncidents = incidents.filter(
        (incident) => incident.severity === "HIGH"
    );

    const mediumIncidents = incidents.filter(
        (incident) => incident.severity === "MEDIUM"
    );

    const getSeverityClass = (severity) => {
        if (severity === "CRITICAL") {
            return styles.critical;
        }

        if (severity === "HIGH") {
            return styles.high;
        }

        return styles.medium;
    };

    return (
        <div className={styles.incidentsPage}>

            {/* ================= HEADER ================= */}

            <div className={styles.top}>

                <div>
                    <h2>INCIDENT MANAGEMENT</h2>

                    <p>
                        Monitor and investigate correlated security incidents
                    </p>
                </div>

                <div className={styles.systemStatus}>
                    ● INCIDENT TRACKING ACTIVE
                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className={styles.stats}>

                <div className={styles.statCard}>
                    <span>TOTAL INCIDENTS</span>

                    <h3>
                        {incidents.length}
                    </h3>

                    <p>
                        All detected incidents
                    </p>
                </div>


                <div className={styles.statCard}>
                    <span>ACTIVE</span>

                    <h3 className={styles.activeNumber}>
                        {activeIncidents.length}
                    </h3>

                    <p>
                        Currently under monitoring
                    </p>
                </div>


                <div className={styles.statCard}>
                    <span>CRITICAL</span>

                    <h3 className={styles.criticalNumber}>
                        {criticalIncidents.length}
                    </h3>

                    <p>
                        Immediate attention required
                    </p>
                </div>


                <div className={styles.statCard}>
                    <span>HIGH PRIORITY</span>

                    <h3 className={styles.highNumber}>
                        {highIncidents.length}
                    </h3>

                    <p>
                        Requires investigation
                    </p>
                </div>

            </div>


            {/* ================= INCIDENT PANEL ================= */}

            <div className={styles.incidentPanel}>

                <div className={styles.panelHeader}>

                    <div>
                        <h3>🚨 ACTIVE INCIDENTS</h3>

                        <p>
                            Multi-camera correlated security events
                        </p>
                    </div>

                    <span>
                        {activeIncidents.length} ACTIVE
                    </span>

                </div>


                {/* ================= INCIDENT LIST ================= */}

                <div className={styles.incidentList}>

                    {incidents.map((incident) => (

                        <div
                            key={incident.id}
                            className={styles.incidentItem}
                        >

                            <div className={styles.incidentIcon}>
                                🚨
                            </div>


                            <div className={styles.incidentInfo}>

                                <div
                                    className={
                                        styles.incidentTitleRow
                                    }
                                >

                                    <div>
                                        <h4>
                                            {incident.title}
                                        </h4>

                                        <small>
                                            {incident.id}
                                        </small>
                                    </div>


                                    <span
                                        className={
                                            getSeverityClass(
                                                incident.severity
                                            )
                                        }
                                    >
                                        {incident.severity}
                                    </span>

                                </div>


                                <p>
                                    📍 {incident.location}
                                </p>


                                <div className={styles.meta}>

                                    <span>
                                        📹 {
                                            incident.cameras?.length || 0
                                        } Camera(s)
                                    </span>

                                    <span>
                                        🔍 {
                                            incident.detections?.length || 0
                                        } Detection(s)
                                    </span>

                                    <span>
                                        📡 {
                                            incident.zones?.length || 0
                                        } Zone(s)
                                    </span>

                                </div>

                            </div>


                            <div className={styles.incidentStatus}>

                                <span>
                                    ● {incident.status}
                                </span>

                            </div>


                            <div className={styles.actions}>

                                <button
                                    onClick={() =>
                                        setSelectedIncident(
                                            incident
                                        )
                                    }
                                >
                                    VIEW
                                </button>

                            </div>

                        </div>

                    ))}


                    {incidents.length === 0 && (

                        <div className={styles.emptyState}>

                            <div className={styles.emptyIcon}>
                                🛡️
                            </div>

                            <h3>
                                NO INCIDENTS DETECTED
                            </h3>

                            <p>
                                AI-detected threats will automatically
                                create incidents when related activity
                                is detected.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* ================= DETAILS MODAL ================= */}

            {selectedIncident && (

                <div
                    className={styles.overlay}
                    onClick={() =>
                        setSelectedIncident(null)
                    }
                >

                    <div
                        className={styles.modal}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() =>
                                setSelectedIncident(null)
                            }
                        >
                            ✕
                        </button>


                        <div className={styles.modalHeader}>

                            <div>

                                <span className={styles.incidentId}>
                                    {selectedIncident.id}
                                </span>

                                <h2>
                                    {selectedIncident.title}
                                </h2>

                                <p>
                                    📍 {
                                        selectedIncident.location
                                    }
                                </p>

                            </div>


                            <span
                                className={
                                    getSeverityClass(
                                        selectedIncident.severity
                                    )
                                }
                            >
                                {selectedIncident.severity}
                            </span>

                        </div>


                        <div className={styles.description}>

                            <span>
                                AI INCIDENT ANALYSIS
                            </span>

                            <p>
                                {selectedIncident.description}
                            </p>

                        </div>


                        <div className={styles.detailsGrid}>

                            <div>

                                <span>
                                    STATUS
                                </span>

                                <strong>
                                    ● {
                                        selectedIncident.status
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    PRIORITY SCORE
                                </span>

                                <strong>
                                    {
                                        selectedIncident.priorityScore
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CAMERAS
                                </span>

                                <strong>
                                    {
                                        selectedIncident.cameras
                                            ?.length || 0
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    DETECTIONS
                                </span>

                                <strong>
                                    {
                                        selectedIncident.detections
                                            ?.length || 0
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* ================= CAMERAS ================= */}

                        <div className={styles.section}>

                            <h3>
                                📹 INVOLVED CAMERAS
                            </h3>


                            <div className={styles.cameraList}>

                                {selectedIncident.cameras?.map(
                                    (camera) => (

                                        <div
                                            key={
                                                camera.cameraId
                                            }
                                            className={
                                                styles.cameraCard
                                            }
                                        >

                                            <strong>
                                                {camera.cameraName}
                                            </strong>

                                            <span>
                                                Coverage: {
                                                    camera.coverageRadius
                                                }m
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ================= DETECTIONS ================= */}

                        <div className={styles.section}>

                            <h3>
                                🔍 DETECTION TIMELINE
                            </h3>


                            <div className={styles.detectionList}>

                                {selectedIncident.detections?.map(
                                    (detection) => (

                                        <div
                                            key={detection.id}
                                            className={
                                                styles.detectionItem
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        detection.className
                                                    }
                                                </strong>

                                                <span>
                                                    📹 {
                                                        detection.camera
                                                    }
                                                </span>

                                            </div>


                                            <span>
                                                {
                                                    (
                                                        detection.confidence *
                                                        100
                                                    ).toFixed(1)
                                                }%
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        <button
                            className={styles.closeModalButton}
                            onClick={() =>
                                setSelectedIncident(null)
                            }
                        >
                            CLOSE INCIDENT
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Incidents;