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
    NORMALIZE CONFIDENCE
    ============================================================

    Supports:

    0.951
    95.1
    "0.951"
    "95.1%"
    */

    const normalizeConfidence = (value) => {

        if (value === undefined || value === null) {
            return 0;
        }

        let number = Number(
            String(value).replace("%", "")
        );

        if (Number.isNaN(number)) {
            return 0;
        }

        if (number > 1) {
            number = number / 100;
        }

        return Math.max(
            0,
            Math.min(number, 1)
        );
    };


    /*
    ============================================================
    NORMALIZE CLASS
    ============================================================
    */

    const normalizeClass = (value) => {

        return String(
            value || "unknown"
        )
            .toLowerCase()
            .trim();

    };


    /*
    ============================================================
    UNIQUE ACTIVE DETECTION STREAMS
    ============================================================

    IMPORTANT:

    YOLO can detect:

    Camera 01 + person
    Camera 01 + person
    Camera 01 + person
    Camera 01 + person

    These are NOT 4 people.

    They are ONE detection stream:

        Camera 01 + person

    Therefore:

        key = cameraId + className

    This gives:

        Camera 01 + person
        Camera 01 + car
        Camera 02 + person

    as separate streams.
    */

    const uniqueStreams = useMemo(() => {

        const streamMap = new Map();


        detections.forEach((detection) => {

            const className =
                normalizeClass(
                    detection.className
                );


            const cameraId =
                detection.cameraId ??
                detection.camera ??
                "unknown";


            const key =
                `${cameraId}-${className}`;


            const confidence =
                normalizeConfidence(
                    detection.confidence
                );


            /*
            Because detections are inserted newest first,
            the first detection for a key is the newest one.
            */

            if (!streamMap.has(key)) {

                streamMap.set(
                    key,
                    {
                        ...detection,
                        className,
                        normalizedConfidence:
                            confidence
                    }
                );

            }

        });


        return Array.from(
            streamMap.values()
        );

    }, [detections]);


    /*
    ============================================================
    DETECTION STATISTICS
    ============================================================
    */

    const statistics = useMemo(() => {

        const people =
            uniqueStreams.filter(
                (detection) =>
                    detection.className ===
                    "person"
            ).length;


        const vehicles =
            uniqueStreams.filter(
                (detection) =>
                    [
                        "car",
                        "truck",
                        "bus",
                        "motorcycle",
                        "bicycle"
                    ].includes(
                        detection.className
                    )
            ).length;


        const animals =
            uniqueStreams.filter(
                (detection) =>
                    [
                        "bird",
                        "cat",
                        "dog",
                        "horse",
                        "sheep",
                        "cow"
                    ].includes(
                        detection.className
                    )
            ).length;


        const unknown =
            uniqueStreams.filter(
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
                    ].includes(
                        detection.className
                    )
            ).length;


        /*
        --------------------------------------------------------
        AVERAGE CONFIDENCE
        --------------------------------------------------------
        */

        let totalConfidence = 0;


        uniqueStreams.forEach(
            (detection) => {

                totalConfidence +=
                    detection.normalizedConfidence;

            }
        );


        const averageConfidence =
            uniqueStreams.length > 0

                ? (
                    totalConfidence /
                    uniqueStreams.length
                ) * 100

                : 0;


        return {

            people,

            vehicles,

            animals,

            unknown,

            totalStreams:
                uniqueStreams.length,

            averageConfidence,

            suspiciousEvents:
                activeThreats.length

        };

    }, [
        uniqueStreams,
        activeThreats
    ]);


    /*
    ============================================================
    BAR WIDTH
    ============================================================
    */

    const getBarWidth = (
        value
    ) => {

        const total =
            statistics.totalStreams;


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
    FORMAT LIVE TIME
    ============================================================
    */

    const formatTime = (
        detection
    ) => {

        if (
            detection?.timestamp
        ) {

            const difference =
                Math.max(
                    0,
                    Date.now() -
                    detection.timestamp
                );


            const seconds =
                Math.floor(
                    difference / 1000
                );


            if (
                seconds < 60
            ) {

                return `${seconds} sec ago`;

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


        return (
            detection?.time ||
            "Recently"
        );

    };


    /*
    ============================================================
    EVENT ICON
    ============================================================
    */

    const getEventIcon = (
        className
    ) => {

        const icons = {

            person:
                "👤",

            car:
                "🚗",

            truck:
                "🚛",

            bus:
                "🚌",

            motorcycle:
                "🏍️",

            bicycle:
                "🚲",

            bird:
                "🐦",

            dog:
                "🐕",

            cat:
                "🐈",

            drone:
                "🚁",

            airplane:
                "✈️"

        };


        return (
            icons[
                className
            ] ||
            "🔍"
        );

    };


    /*
    ============================================================
    EVENT TITLE
    ============================================================
    */

    const getEventTitle = (
        detection
    ) => {

        if (
            detection.isThreat
        ) {

            if (
                detection.severity ===
                "CRITICAL"
            ) {

                return "Critical Threat Detected";

            }


            if (
                detection.severity ===
                "HIGH"
            ) {

                return "High Priority Threat Detected";

            }


            if (
                detection.severity ===
                "MEDIUM"
            ) {

                return "Suspicious Activity Detected";

            }


            return "AI Threat Detection";

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
    RECENT UNIQUE AI EVENTS
    ============================================================

    IMPORTANT:

    We DO NOT use:

        detections.slice(0, 8)

    because that would show:

        person
        person
        person
        person
        person

    Instead we use uniqueStreams.
    */

    const recentEvents =
        uniqueStreams
            .sort(
                (a, b) =>
                    (
                        b.timestamp || 0
                    ) -
                    (
                        a.timestamp || 0
                    )
            )
            .slice(
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
                        Unique active detection streams
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
                        Unique active detection streams
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
                MAIN GRID
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
                                />

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
                                />

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
                                />

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
                                />

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
                            Latest unique detections generated by AI
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
                                        `${detection.cameraId}-${detection.className}`
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
                                                    detection.normalizedConfidence *
                                                    100
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