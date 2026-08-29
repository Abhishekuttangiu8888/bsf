import { useMemo } from "react";
import styles from "./AIAnalytics.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function AIAnalytics() {

    const {
        detections = [],
        activeThreats = []
    } = useSurveillance();


    /*
    ============================================================
    DETECTION STATISTICS
    ============================================================
    */

    const statistics = useMemo(() => {

        const people = detections.filter(
            (detection) =>
                detection.className === "person"
        ).length;


        const vehicles = detections.filter(
            (detection) =>
                [
                    "car",
                    "truck",
                    "bus",
                    "motorcycle",
                    "bicycle"
                ].includes(detection.className)
        ).length;


        const animals = detections.filter(
            (detection) =>
                [
                    "bird",
                    "cat",
                    "dog",
                    "horse",
                    "sheep",
                    "cow"
                ].includes(detection.className)
        ).length;


        const unknown = detections.filter(
            (detection) =>
                ![
                    "person",
                    "car",
                    "truck",
                    "bus",
                    "motorcycle",
                    "bicycle",
                    "bird",
                    "cat",
                    "dog",
                    "horse",
                    "sheep",
                    "cow",
                    "drone",
                    "airplane"
                ].includes(detection.className)
        ).length;


        const totalDetections =
            detections.length;


        /*
        --------------------------------------------------------
        AVERAGE AI CONFIDENCE
        --------------------------------------------------------
        */

        let totalConfidence = 0;

        detections.forEach((detection) => {

            const confidence =
                Number(detection.confidence);

            if (!Number.isNaN(confidence)) {

                totalConfidence +=
                    confidence;

            }

        });


        const averageConfidence =
            totalDetections > 0
                ? (
                    totalConfidence /
                    totalDetections
                ) * 100
                : 0;


        return {

            people,

            vehicles,

            animals,

            unknown,

            totalDetections,

            averageConfidence,

            suspiciousEvents:
                activeThreats.length

        };

    }, [
        detections,
        activeThreats
    ]);


    /*
    ============================================================
    BAR WIDTHS
    ============================================================
    */

    const getBarWidth = (
        value
    ) => {

        const total =
            statistics.totalDetections;


        if (
            total === 0
        ) {

            return "0%";

        }


        return `${Math.min(
            (value / total) * 100,
            100
        )}%`;

    };


    /*
    ============================================================
    FORMAT TIME
    ============================================================
    */

    const formatTime = (
        detection
    ) => {

        if (
            detection?.timestamp
        ) {

            const difference =
                Date.now() -
                detection.timestamp;


            const seconds =
                Math.floor(
                    difference / 1000
                );


            if (
                seconds < 60
            ) {

                return `${Math.max(
                    seconds,
                    0
                )} sec ago`;

            }


            const minutes =
                Math.floor(
                    seconds / 60
                );


            if (
                minutes < 60
            ) {

                return `${minutes} min ago`;

            }


            const hours =
                Math.floor(
                    minutes / 60
                );


            return `${hours} hr ago`;

        }


        return detection?.time || "Recently";

    };


    /*
    ============================================================
    GET EVENT ICON
    ============================================================
    */

    const getEventIcon = (
        className
    ) => {

        const icons = {

            person: "👤",

            car: "🚗",

            truck: "🚛",

            bus: "🚌",

            motorcycle: "🏍️",

            bicycle: "🚲",

            bird: "🐦",

            dog: "🐕",

            cat: "🐈",

            drone: "🚁",

            airplane: "✈️"

        };


        return (
            icons[className] ||
            "🔍"
        );

    };


    /*
    ============================================================
    GET EVENT TITLE
    ============================================================
    */

    const getEventTitle = (
        detection
    ) => {

        if (
            detection.isThreat
        ) {

            return (
                detection.severity ===
                "CRITICAL"

                    ? "Critical Threat Detected"

                    : detection.severity ===
                      "HIGH"

                        ? "High Priority Threat Detected"

                        : detection.severity ===
                          "MEDIUM"

                            ? "Suspicious Activity Detected"

                            : "AI Threat Detection"
            );

        }


        const names = {

            person:
                "Person Detected",

            car:
                "Vehicle Detected",

            truck:
                "Truck Detected",

            bus:
                "Bus Detected",

            motorcycle:
                "Motorcycle Detected",

            bicycle:
                "Bicycle Detected",

            bird:
                "Bird Detected",

            dog:
                "Dog Detected",

            cat:
                "Cat Detected",

            drone:
                "Drone Detected",

            airplane:
                "Aircraft Detected"

        };


        return (
            names[
                detection.className
            ] ||
            "Object Detected"
        );

    };


    /*
    ============================================================
    RECENT EVENTS
    ============================================================
    */

    const recentEvents =
        detections.slice(
            0,
            8
        );


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div
            className={
                styles.analytics
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
                        AI ANALYTICS
                    </h2>

                    <p>
                        Intelligent analysis of surveillance
                        and threat detection data
                    </p>

                </div>


                <div
                    className={
                        styles.status
                    }
                >

                    ● AI ENGINE ONLINE

                </div>

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div
                className={
                    styles.summaryGrid
                }
            >

                {/* ACCURACY */}

                <div
                    className={
                        styles.card
                    }
                >

                    <span>
                        DETECTION ACCURACY
                    </span>

                    <strong>
                        {
                            statistics.averageConfidence.toFixed(
                                1
                            )
                        }%
                    </strong>

                    <p>
                        Average AI confidence
                    </p>

                </div>


                {/* PEOPLE */}

                <div
                    className={
                        styles.card
                    }
                >

                    <span>
                        PEOPLE DETECTED
                    </span>

                    <strong>
                        {
                            statistics.people
                        }
                    </strong>

                    <p>
                        Recorded AI detections
                    </p>

                </div>


                {/* VEHICLES */}

                <div
                    className={
                        styles.card
                    }
                >

                    <span>
                        VEHICLES DETECTED
                    </span>

                    <strong>
                        {
                            statistics.vehicles
                        }
                    </strong>

                    <p>
                        Recorded AI detections
                    </p>

                </div>


                {/* THREATS */}

                <div
                    className={
                        styles.card
                    }
                >

                    <span>
                        SUSPICIOUS EVENTS
                    </span>

                    <strong
                        className={
                            styles.red
                        }
                    >
                        {
                            statistics.suspiciousEvents
                        }
                    </strong>

                    <p>
                        Active AI threats
                    </p>

                </div>

            </div>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div
                className={
                    styles.mainGrid
                }
            >

                {/* ==================================================
                    DETECTION ANALYSIS
                ================================================== */}

                <div
                    className={
                        styles.analysisCard
                    }
                >

                    <div
                        className={
                            styles.cardHeader
                        }
                    >

                        <div>

                            <h3>
                                DETECTION ANALYSIS
                            </h3>

                            <p>
                                AI classification overview
                            </p>

                        </div>


                        <span>
                            LIVE
                        </span>

                    </div>


                    <div
                        className={
                            styles.bars
                        }
                    >

                        {/* PERSON */}

                        <div
                            className={
                                styles.barItem
                            }
                        >

                            <div
                                className={
                                    styles.barLabel
                                }
                            >

                                <span>
                                    PERSON
                                </span>

                                <strong>
                                    {
                                        statistics.people
                                    }
                                </strong>

                            </div>


                            <div
                                className={
                                    styles.barBackground
                                }
                            >

                                <div
                                    className={
                                        styles.personBar
                                    }

                                    style={{
                                        width:
                                            getBarWidth(
                                                statistics.people
                                            )
                                    }}
                                ></div>

                            </div>

                        </div>


                        {/* VEHICLE */}

                        <div
                            className={
                                styles.barItem
                            }
                        >

                            <div
                                className={
                                    styles.barLabel
                                }
                            >

                                <span>
                                    VEHICLE
                                </span>

                                <strong>
                                    {
                                        statistics.vehicles
                                    }
                                </strong>

                            </div>


                            <div
                                className={
                                    styles.barBackground
                                }
                            >

                                <div
                                    className={
                                        styles.vehicleBar
                                    }

                                    style={{
                                        width:
                                            getBarWidth(
                                                statistics.vehicles
                                            )
                                    }}
                                ></div>

                            </div>

                        </div>


                        {/* ANIMAL */}

                        <div
                            className={
                                styles.barItem
                            }
                        >

                            <div
                                className={
                                    styles.barLabel
                                }
                            >

                                <span>
                                    ANIMAL
                                </span>

                                <strong>
                                    {
                                        statistics.animals
                                    }
                                </strong>

                            </div>


                            <div
                                className={
                                    styles.barBackground
                                }
                            >

                                <div
                                    className={
                                        styles.animalBar
                                    }

                                    style={{
                                        width:
                                            getBarWidth(
                                                statistics.animals
                                            )
                                    }}
                                ></div>

                            </div>

                        </div>


                        {/* UNKNOWN */}

                        <div
                            className={
                                styles.barItem
                            }
                        >

                            <div
                                className={
                                    styles.barLabel
                                }
                            >

                                <span>
                                    UNKNOWN
                                </span>

                                <strong>
                                    {
                                        statistics.unknown
                                    }
                                </strong>

                            </div>


                            <div
                                className={
                                    styles.barBackground
                                }
                            >

                                <div
                                    className={
                                        styles.unknownBar
                                    }

                                    style={{
                                        width:
                                            getBarWidth(
                                                statistics.unknown
                                            )
                                    }}
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    AI MODEL STATUS
                ================================================== */}

                <div
                    className={
                        styles.modelCard
                    }
                >

                    <h3>
                        AI MODEL STATUS
                    </h3>


                    <p
                        className={
                            styles.modelDescription
                        }
                    >
                        Current detection models
                    </p>


                    <div
                        className={
                            styles.model
                        }
                    >

                        <div>

                            <strong>
                                OBJECT DETECTION
                            </strong>

                            <span>
                                YOLO Vision Model
                            </span>

                        </div>

                        <b>
                            ONLINE
                        </b>

                    </div>


                    <div
                        className={
                            styles.model
                        }
                    >

                        <div>

                            <strong>
                                THREAT CLASSIFICATION
                            </strong>

                            <span>
                                AI Threat Assessment Engine
                            </span>

                        </div>

                        <b>
                            ONLINE
                        </b>

                    </div>


                    <div
                        className={
                            styles.model
                        }
                    >

                        <div>

                            <strong>
                                CONFIDENCE ANALYSIS
                            </strong>

                            <span>
                                Real-time confidence scoring
                            </span>

                        </div>

                        <b>
                            ONLINE
                        </b>

                    </div>


                    <div
                        className={
                            styles.model
                        }
                    >

                        <div>

                            <strong>
                                INCIDENT CORRELATION
                            </strong>

                            <span>
                                Multi-camera event analysis
                            </span>

                        </div>

                        <b>
                            ONLINE
                        </b>

                    </div>

                </div>

            </div>


            {/* ==================================================
                RECENT AI EVENTS
            ================================================== */}

            <div
                className={
                    styles.eventsCard
                }
            >

                <div
                    className={
                        styles.cardHeader
                    }
                >

                    <div>

                        <h3>
                            RECENT AI EVENTS
                        </h3>

                        <p>
                            Latest detections generated by AI
                        </p>

                    </div>


                    <span>
                        LIVE
                    </span>

                </div>


                <div
                    className={
                        styles.events
                    }
                >

                    {recentEvents.length > 0 ? (

                        recentEvents.map(
                            (detection) => (

                                <div
                                    key={
                                        detection.id
                                    }

                                    className={
                                        styles.event
                                    }
                                >

                                    <div
                                        className={
                                            styles.eventIcon
                                        }
                                    >

                                        {
                                            getEventIcon(
                                                detection.className
                                            )
                                        }

                                    </div>


                                    <div
                                        className={
                                            styles.eventInfo
                                        }
                                    >

                                        <strong>
                                            {
                                                getEventTitle(
                                                    detection
                                                )
                                            }
                                        </strong>


                                        <p>

                                            {
                                                detection.location ||
                                                "Unknown location"
                                            }

                                            {" • "}

                                            {
                                                detection.camera ||
                                                "Unknown camera"
                                            }

                                            {" • "}

                                            Confidence:{" "}

                                            {
                                                (
                                                    Number(
                                                        detection.confidence
                                                    ) * 100
                                                ).toFixed(
                                                    1
                                                )
                                            }%

                                        </p>

                                    </div>


                                    <div
                                        className={
                                            styles.eventTime
                                        }
                                    >

                                        {
                                            formatTime(
                                                detection
                                            )
                                        }

                                    </div>

                                </div>

                            )

                        )

                    ) : (

                        <div
                            className={
                                styles.event
                            }
                        >

                            <div
                                className={
                                    styles.eventIcon
                                }
                            >
                                🛡️
                            </div>


                            <div
                                className={
                                    styles.eventInfo
                                }
                            >

                                <strong>
                                    No AI Events Yet
                                </strong>

                                <p>
                                    Waiting for YOLO detections
                                    from surveillance cameras
                                </p>

                            </div>


                            <div
                                className={
                                    styles.eventTime
                                }
                            >

                                WAITING

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default AIAnalytics;