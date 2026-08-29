import { useState } from "react";

import styles from "./ActiveAlerts.module.css";

import {
    useSurveillance
} from "../context/SurveillanceContext";


function ActiveAlerts() {

    const {
        threats: alerts,
        acknowledgeThreat,
        activeThreats: activeAlerts,
        criticalThreats: criticalAlerts,
        highThreats: highAlerts,
        mediumThreats: mediumAlerts,
        viewCameraLive
    } = useSurveillance();


    const [
        selectedAlert,
        setSelectedAlert
    ] = useState(null);


    // ========================================================
    // ACKNOWLEDGE ALERT
    // ========================================================

    const acknowledgeAlert = (id) => {

        if (
            id === undefined ||
            id === null
        ) {

            return;

        }


        acknowledgeThreat(id);

        setSelectedAlert(null);

    };


    // ========================================================
    // VIEW RELATED CAMERA
    // ========================================================

    const handleViewCamera = () => {

        if (!selectedAlert) {

            return;

        }


        if (
            selectedAlert.cameraId === undefined ||
            selectedAlert.cameraId === null
        ) {

            console.warn(
                "Camera ID is not available for this alert."
            );

            return;

        }


        /*
        Close modal first.
        */

        setSelectedAlert(null);


        /*
        Navigate to Live Surveillance /
        Cameras page.
        */

        viewCameraLive(
            selectedAlert.cameraId
        );

    };


    // ========================================================
    // SEVERITY BADGE
    // ========================================================

    const getSeverityClass = (
        severity
    ) => {

        if (
            severity === "CRITICAL"
        ) {

            return styles.criticalBadge;

        }


        if (
            severity === "HIGH"
        ) {

            return styles.highBadge;

        }


        return styles.mediumBadge;

    };


    // ========================================================
    // STATUS CLASS
    // ========================================================

    const getStatusClass = (
        status
    ) => {

        if (
            status === "ACTIVE"
        ) {

            return styles.activeStatus;

        }


        return styles.acknowledgedStatus;

    };


    return (

        <div
            className={
                styles.alertsPage
            }
        >

            {/* ==================================================
                TOP
            ================================================== */}

            <div
                className={
                    styles.top
                }
            >

                <div>

                    <h2>
                        ACTIVE ALERTS
                    </h2>

                    <p>
                        Real-time security alerts requiring attention
                    </p>

                </div>


                <div
                    className={
                        styles.liveStatus
                    }
                >

                    ● ALERT MONITORING ACTIVE

                </div>

            </div>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div
                className={
                    styles.stats
                }
            >

                {/* ACTIVE */}

                <div
                    className={
                        styles.statCard
                    }
                >

                    <span>
                        ACTIVE ALERTS
                    </span>

                    <h3>
                        {
                            activeAlerts.length
                        }
                    </h3>

                    <p>
                        Currently requiring attention
                    </p>

                </div>


                {/* CRITICAL */}

                <div
                    className={
                        styles.statCard
                    }
                >

                    <span>
                        CRITICAL
                    </span>

                    <h3
                        className={
                            styles.critical
                        }
                    >
                        {
                            criticalAlerts.length
                        }
                    </h3>

                    <p>
                        Immediate response required
                    </p>

                </div>


                {/* HIGH */}

                <div
                    className={
                        styles.statCard
                    }
                >

                    <span>
                        HIGH PRIORITY
                    </span>

                    <h3
                        className={
                            styles.high
                        }
                    >
                        {
                            highAlerts.length
                        }
                    </h3>

                    <p>
                        Requires investigation
                    </p>

                </div>


                {/* MEDIUM */}

                <div
                    className={
                        styles.statCard
                    }
                >

                    <span>
                        MEDIUM
                    </span>

                    <h3
                        className={
                            styles.medium
                        }
                    >
                        {
                            mediumAlerts.length
                        }
                    </h3>

                    <p>
                        Under monitoring
                    </p>

                </div>

            </div>


            {/* ==================================================
                ALERT PANEL
            ================================================== */}

            <div
                className={
                    styles.alertPanel
                }
            >

                <div
                    className={
                        styles.panelHeader
                    }
                >

                    <div>

                        <h3>
                            🚨 SECURITY ALERTS
                        </h3>

                        <p>
                            Latest alerts generated by the AI detection system
                        </p>

                    </div>


                    <span>
                        {
                            activeAlerts.length
                        }{" "}
                        ACTIVE
                    </span>

                </div>


                {/* ==================================================
                    ALERT LIST
                ================================================== */}

                <div
                    className={
                        styles.alertList
                    }
                >

                    {alerts.length === 0 ? (

                        <div
                            style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: "var(--text-muted)",
                                fontSize: "12px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "28px",
                                    marginBottom: "10px"
                                }}
                            >
                                ✓
                            </div>

                            <strong>
                                NO SECURITY ALERTS
                            </strong>

                            <p>
                                AI surveillance is monitoring all active cameras.
                            </p>

                        </div>

                    ) : (

                        alerts.map(
                            (alert) => (

                                <div
                                    key={
                                        alert.id
                                    }

                                    className={`
                                        ${styles.alertItem}
                                        ${
                                            alert.status ===
                                            "ACKNOWLEDGED"
                                                ? styles.acknowledged
                                                : ""
                                        }
                                    `}
                                >

                                    {/* ALERT ICON */}

                                    <div
                                        className={
                                            styles.alertIcon
                                        }
                                    >

                                        {
                                            alert.icon ||
                                            "⚠"
                                        }

                                    </div>


                                    {/* ALERT INFORMATION */}

                                    <div
                                        className={
                                            styles.alertInfo
                                        }
                                    >

                                        <div
                                            className={
                                                styles.alertTitleRow
                                            }
                                        >

                                            <h4>
                                                {
                                                    alert.title
                                                }
                                            </h4>


                                            <span
                                                className={
                                                    getSeverityClass(
                                                        alert.severity
                                                    )
                                                }
                                            >

                                                {
                                                    alert.severity
                                                }

                                            </span>

                                        </div>


                                        <p>

                                            📹{" "}
                                            {
                                                alert.camera
                                            }

                                            <span>
                                                {" • "}
                                            </span>

                                            📍{" "}
                                            {
                                                alert.location
                                            }

                                        </p>


                                        <div
                                            className={
                                                styles.alertMeta
                                            }
                                        >

                                            <span>
                                                AI Confidence:{" "}
                                                {
                                                    alert.confidence
                                                }
                                            </span>


                                            <span>
                                                Detected:{" "}
                                                {
                                                    alert.time
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className={
                                            styles.alertStatus
                                        }
                                    >

                                        <span
                                            className={
                                                getStatusClass(
                                                    alert.status
                                                )
                                            }
                                        >

                                            ●{" "}
                                            {
                                                alert.status
                                            }

                                        </span>

                                    </div>


                                    {/* ACTION */}

                                    <div
                                        className={
                                            styles.alertAction
                                        }
                                    >

                                        {alert.status ===
                                            "ACTIVE" && (

                                            <button
                                                onClick={() =>
                                                    setSelectedAlert(
                                                        alert
                                                    )
                                                }
                                            >

                                                VIEW

                                            </button>

                                        )}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>


            {/* ==================================================
                ALERT DETAILS MODAL
            ================================================== */}

            {selectedAlert && (

                <div
                    className={
                        styles.modalOverlay
                    }

                    onClick={() =>
                        setSelectedAlert(
                            null
                        )
                    }
                >

                    <div
                        className={
                            styles.modal
                        }

                        onClick={
                            (event) =>
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
                                    ALERT DETAILS
                                </h3>

                                <p>
                                    Security event information
                                </p>

                            </div>


                            <button
                                className={
                                    styles.closeButton
                                }

                                onClick={() =>
                                    setSelectedAlert(
                                        null
                                    )
                                }
                            >

                                ✕

                            </button>

                        </div>


                        {/* ==================================================
                            ALERT TITLE
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
                                    selectedAlert.icon ||
                                    "⚠"
                                }

                            </div>


                            <div>

                                <h2>
                                    {
                                        selectedAlert.title
                                    }
                                </h2>


                                <span
                                    className={

                                        selectedAlert.severity ===
                                        "CRITICAL"

                                            ? styles.criticalText

                                            : selectedAlert.severity ===
                                              "HIGH"

                                                ? styles.highText

                                                : styles.mediumText

                                    }
                                >

                                    ●{" "}
                                    {
                                        selectedAlert.severity
                                    }

                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            AI ANALYSIS
                        ================================================== */}

                        <div
                            className={
                                styles.description
                            }
                        >

                            <span>
                                AI ANALYSIS
                            </span>

                            <p>
                                {
                                    selectedAlert.description ||
                                    "AI detected suspicious activity in the monitored border zone."
                                }
                            </p>

                        </div>


                        {/* ==================================================
                            DETAILS
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
                                        selectedAlert.camera
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    {
                                        selectedAlert.location
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CONFIDENCE
                                </span>

                                <strong>
                                    {
                                        selectedAlert.confidence
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    DETECTED AT
                                </span>

                                <strong>
                                    {
                                        selectedAlert.time
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    STATUS
                                </span>

                                <strong>
                                    {
                                        selectedAlert.status
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CAMERA ID
                                </span>

                                <strong>
                                    #
                                    {
                                        selectedAlert.cameraId
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className={
                                styles.modalActions
                            }
                        >

                            {/* VIEW CAMERA */}

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


                            {/* ACKNOWLEDGE */}

                            <button
                                className={
                                    styles.acknowledgeButton
                                }

                                onClick={() =>
                                    acknowledgeAlert(
                                        selectedAlert.id
                                    )
                                }
                            >

                                ✓ ACKNOWLEDGE

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default ActiveAlerts;