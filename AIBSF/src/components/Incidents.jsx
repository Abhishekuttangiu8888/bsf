import { useState } from "react";
import styles from "./Incidents.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function Incidents() {

    const {
        incidents,
        threats,
        acknowledgeThreat
    } = useSurveillance();

    const [selectedIncident, setSelectedIncident] =
        useState(null);


    const getSeverityClass = (severity) => {

        if (severity === "CRITICAL") {
            return styles.critical;
        }

        if (severity === "HIGH") {
            return styles.high;
        }

        return styles.medium;

    };


    const getStatusClass = (status) => {

        if (status === "ACTIVE") {
            return styles.activeStatus;
        }

        if (status === "ACKNOWLEDGED") {
            return styles.acknowledgedStatus;
        }

        return styles.resolvedStatus;

    };


    const formatTime = (timestamp) => {

        if (!timestamp) {
            return "—";
        }

        return new Date(timestamp)
            .toLocaleString();

    };


    const activeIncidents =
        incidents.filter(
            (incident) =>
                incident.status === "ACTIVE"
        );


    const criticalIncidents =
        incidents.filter(
            (incident) =>
                incident.severity === "CRITICAL"
        );


    const totalDetections =
        incidents.reduce(
            (total, incident) =>
                total +
                incident.detections.length,
            0
        );


    const handleAcknowledgeIncident = (
        incident
    ) => {

        const relatedCameraIds =
            incident.cameras.map(
                (camera) =>
                    camera.cameraId
            );


        threats
            .filter(
                (threat) =>

                    relatedCameraIds.includes(
                        threat.cameraId
                    ) &&

                    threat.status === "ACTIVE"
            )
            .forEach(
                (threat) =>
                    acknowledgeThreat(
                        threat.id
                    )
            );

    };


    return (

        <div className={styles.incidents}>


            {/* ================= HEADER ================= */}

            <div className={styles.top}>

                <div>

                    <h2>
                        INCIDENT MANAGEMENT
                    </h2>

                    <p>
                        Correlated security incidents from AI detections
                    </p>

                </div>


                <div className={styles.liveStatus}>
                    ● INCIDENT MONITORING ACTIVE
                </div>

            </div>


            {/* ================= STATISTICS ================= */}

            <div className={styles.stats}>


                <div className={styles.statCard}>

                    <span>
                        TOTAL INCIDENTS
                    </span>

                    <h3>
                        {incidents.length}
                    </h3>

                    <p>
                        AI correlated incidents
                    </p>

                </div>


                <div className={styles.statCard}>

                    <span>
                        ACTIVE
                    </span>

                    <h3 className={styles.activeNumber}>
                        {activeIncidents.length}
                    </h3>

                    <p>
                        Require attention
                    </p>

                </div>


                <div className={styles.statCard}>

                    <span>
                        CRITICAL
                    </span>

                    <h3 className={styles.criticalNumber}>
                        {criticalIncidents.length}
                    </h3>

                    <p>
                        High risk incidents
                    </p>

                </div>


                <div className={styles.statCard}>

                    <span>
                        TOTAL DETECTIONS
                    </span>

                    <h3>
                        {totalDetections}
                    </h3>

                    <p>
                        Linked AI detections
                    </p>

                </div>


            </div>


            {/* ================= INCIDENT LIST ================= */}

            <div className={styles.incidentPanel}>


                <div className={styles.panelHeader}>

                    <div>

                        <h3>
                            🚨 CORRELATED INCIDENTS
                        </h3>

                        <p>
                            Multiple AI detections grouped into security incidents
                        </p>

                    </div>

                    <span>
                        {activeIncidents.length} ACTIVE
                    </span>

                </div>


                <div className={styles.incidentList}>


                    {incidents.length === 0 && (

                        <div className={styles.emptyState}>

                            <div className={styles.emptyIcon}>
                                🛡️
                            </div>

                            <h3>
                                NO INCIDENTS DETECTED
                            </h3>

                            <p>
                                AI correlated incidents will appear here automatically.
                            </p>

                        </div>

                    )}


                    {incidents.map((incident) => (

                        <div
                            className={styles.incidentItem}
                            key={incident.id}
                        >


                            <div className={styles.incidentMain}>


                                <div
                                    className={
                                        styles.incidentIcon
                                    }
                                >
                                    🚨
                                </div>


                                <div
                                    className={
                                        styles.incidentInfo
                                    }
                                >


                                    <div
                                        className={
                                            styles.incidentTitle
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


                                    <div
                                        className={
                                            styles.incidentMeta
                                        }
                                    >

                                        <span>
                                            📹 {incident.cameras.length} Camera
                                            {incident.cameras.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>

                                        <span>
                                            🎯 {incident.detections.length} Detection
                                            {incident.detections.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>

                                        <span>
                                            🕒 {formatTime(
                                                incident.lastUpdated
                                            )}
                                        </span>

                                    </div>


                                </div>


                            </div>


                            <div
                                className={
                                    styles.incidentRight
                                }
                            >

                                <span
                                    className={
                                        getStatusClass(
                                            incident.status
                                        )
                                    }
                                >
                                    ● {incident.status}
                                </span>


                                <button
                                    className={
                                        styles.viewButton
                                    }
                                    onClick={() =>
                                        setSelectedIncident(
                                            incident
                                        )
                                    }
                                >
                                    VIEW DETAILS
                                </button>


                            </div>


                        </div>

                    ))}


                </div>

            </div>


            {/* ================= INCIDENT DETAILS ================= */}

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


                        <div
                            className={styles.modalHeader}
                        >

                            <div>

                                <span>
                                    INCIDENT DETAILS
                                </span>

                                <h2>
                                    {selectedIncident.title}
                                </h2>

                                <p>
                                    {selectedIncident.id}
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


                        <div
                            className={
                                styles.description
                            }
                        >

                            <span>
                                AI ANALYSIS
                            </span>

                            <p>
                                {selectedIncident.description}
                            </p>

                        </div>


                        <div
                            className={
                                styles.detailsGrid
                            }
                        >

                            <div>

                                <span>
                                    STATUS
                                </span>

                                <strong
                                    className={
                                        getStatusClass(
                                            selectedIncident.status
                                        )
                                    }
                                >
                                    ● {selectedIncident.status}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    {selectedIncident.location}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    DETECTIONS
                                </span>

                                <strong>
                                    {selectedIncident.detections.length}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CAMERAS
                                </span>

                                <strong>
                                    {selectedIncident.cameras.length}
                                </strong>

                            </div>


                        </div>


                        {/* ================= CAMERAS ================= */}

                        <div
                            className={
                                styles.section
                            }
                        >

                            <h3>
                                📹 RELATED CAMERAS
                            </h3>


                            <div
                                className={
                                    styles.cameraList
                                }
                            >

                                {selectedIncident.cameras.map(
                                    (camera) => (

                                        <div
                                            className={
                                                styles.cameraCard
                                            }
                                            key={
                                                camera.cameraId
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

                        <div
                            className={
                                styles.section
                            }
                        >

                            <h3>
                                🎯 DETECTION HISTORY
                            </h3>


                            <div
                                className={
                                    styles.detectionList
                                }
                            >

                                {selectedIncident.detections.map(
                                    (detection) => (

                                        <div
                                            className={
                                                styles.detectionItem
                                            }
                                            key={
                                                detection.id
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {detection.className}
                                                </strong>

                                                <p>
                                                    {detection.camera}
                                                </p>

                                            </div>


                                            <div>

                                                <strong>
                                                    {(
                                                        detection.confidence * 100
                                                    ).toFixed(1)}%
                                                </strong>

                                                <p>
                                                    {detection.time}
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ================= ACTIONS ================= */}

                        <div
                            className={
                                styles.modalActions
                            }
                        >

                            {selectedIncident.status ===
                                "ACTIVE" && (

                                <button
                                    className={
                                        styles.acknowledgeButton
                                    }
                                    onClick={() =>
                                        handleAcknowledgeIncident(
                                            selectedIncident
                                        )
                                    }
                                >
                                    ✓ ACKNOWLEDGE INCIDENT
                                </button>

                            )}


                            <button
                                className={
                                    styles.closeAction
                                }
                                onClick={() =>
                                    setSelectedIncident(null)
                                }
                            >
                                CLOSE
                            </button>


                        </div>


                    </div>

                </div>

            )}

        </div>

    );

}

export default Incidents;