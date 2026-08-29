import {
    createContext,
    useContext,
    useState,
    useRef
} from "react";

import {
    assessThreat
} from "../utils/threatEngine";

import {
    findRelatedIncident,
    updateIncident
} from "../utils/incidentEngine";


const SurveillanceContext = createContext();


/*
============================================================
CAMERAS
============================================================
*/

const initialCameras = [

    {
        id: 1,
        name: "Camera 01",
        location: "North Border Sector",
        status: "ACTIVE",
        lastUpdate: "Just now",
        x: "20%",
        y: "25%",
        coverageRadius: 500,
        zone: "NORTH_ZONE",
        latitude: 15.8501,
        longitude: 76.2301
    },

    {
        id: 2,
        name: "Camera 02",
        location: "South Border Sector",
        status: "ACTIVE",
        lastUpdate: "1 min ago",
        x: "35%",
        y: "72%",
        coverageRadius: 500,
        zone: "SOUTH_ZONE",
        latitude: 15.8402,
        longitude: 76.2405
    },

    {
        id: 3,
        name: "Camera 03",
        location: "East Border Sector",
        status: "WARNING",
        lastUpdate: "2 min ago",
        x: "78%",
        y: "35%",
        coverageRadius: 600,
        zone: "EAST_ZONE",
        latitude: 15.8550,
        longitude: 76.2550
    },

    {
        id: 4,
        name: "Camera 04",
        location: "West Border Sector",
        status: "OFFLINE",
        lastUpdate: "18 min ago",
        x: "18%",
        y: "55%",
        coverageRadius: 400,
        zone: "WEST_ZONE",
        latitude: 15.8450,
        longitude: 76.2150
    },

    {
        id: 5,
        name: "Camera 05",
        location: "North-East Border Sector",
        status: "ACTIVE",
        lastUpdate: "Just now",
        x: "62%",
        y: "20%",
        coverageRadius: 700,
        zone: "NORTH_EAST_ZONE",
        latitude: 15.8600,
        longitude: 76.2450
    },

    {
        id: 6,
        name: "Camera 06",
        location: "South-East Border Sector",
        status: "ACTIVE",
        lastUpdate: "3 min ago",
        x: "70%",
        y: "75%",
        coverageRadius: 600,
        zone: "SOUTH_EAST_ZONE",
        latitude: 15.8350,
        longitude: 76.2500
    },

    {
        id: 7,
        name: "Camera 07",
        location: "North-West Border Sector",
        status: "ACTIVE",
        lastUpdate: "1 min ago",
        x: "40%",
        y: "15%",
        coverageRadius: 500,
        zone: "NORTH_WEST_ZONE",
        latitude: 15.8600,
        longitude: 76.2200
    },

    {
        id: 8,
        name: "Camera 08",
        location: "Central Border Sector",
        status: "WARNING",
        lastUpdate: "4 min ago",
        x: "50%",
        y: "50%",
        coverageRadius: 800,
        zone: "CENTRAL_ZONE",
        latitude: 15.8500,
        longitude: 76.2350
    }

];


/*
============================================================
NO STATIC THREATS
============================================================

All threats are generated from YOLO detections.
*/

const initialThreats = [];


export function SurveillanceProvider({ children }) {

    const [cameras, setCameras] =
        useState(initialCameras);


    const [threats, setThreats] =
        useState(initialThreats);


    const [detections, setDetections] =
        useState([]);


    const [incidents, setIncidents] =
        useState([]);


    const [activePage, setActivePage] =
        useState("dashboard");


    const [pendingCameraId, setPendingCameraId] =
        useState(null);


    /*
    ============================================================
    ID GENERATORS
    ============================================================
    */

    const nextThreatId =
        useRef(1);


    const nextIncidentId =
        useRef(1);


    /*
    ============================================================
    DUPLICATE DETECTION CONTROL
    ============================================================

    Same camera + same object should not create a new threat
    every 3 seconds.

    Example:

    Camera 01 + person
        ↓
    Create threat

    Camera 01 + person after 3 sec
        ↓
    Update existing threat

    Camera 01 + person after another 3 sec
        ↓
    Update existing threat

    Different camera + person
        ↓
    New threat
    */

    const recentDetectionRef =
        useRef({});


    /*
    ============================================================
    ACKNOWLEDGE THREAT
    ============================================================
    */

    const acknowledgeThreat = (id) => {

        setThreats((prevThreats) => {

            const updatedThreats =
                prevThreats.map((threat) => {

                    if (threat.id !== id) {

                        return threat;

                    }

                    return {

                        ...threat,

                        status:
                            "ACKNOWLEDGED",

                        investigationStatus:
                            "ACKNOWLEDGED"

                    };

                });


            const acknowledgedThreat =
                updatedThreats.find(
                    (threat) =>
                        threat.id === id
                );


            /*
            UPDATE RELATED INCIDENT
            */

            setIncidents((prevIncidents) =>

                prevIncidents.map((incident) => {

                    const isRelatedIncident =
                        incident.detections?.some(
                            (detection) =>
                                detection.cameraId ===
                                acknowledgedThreat?.cameraId
                        );


                    if (!isRelatedIncident) {

                        return incident;

                    }


                    const relatedThreats =
                        updatedThreats.filter(
                            (threat) =>
                                incident.cameras?.some(
                                    (camera) =>
                                        camera.cameraId ===
                                        threat.cameraId
                                )
                        );


                    const allAcknowledged =

                        relatedThreats.length > 0 &&

                        relatedThreats.every(
                            (threat) =>
                                threat.status ===
                                "ACKNOWLEDGED"
                        );


                    return {

                        ...incident,

                        status:
                            allAcknowledged
                                ? "ACKNOWLEDGED"
                                : "ACTIVE",

                        lastUpdated:
                            Date.now()

                    };

                })

            );


            return updatedThreats;

        });

    };


    /*
    ============================================================
    UPDATE CAMERA STATUS
    ============================================================
    */

    const updateCameraStatus = (
        id,
        newStatus
    ) => {

        setCameras((prev) =>

            prev.map((camera) =>

                camera.id === id

                    ? {

                        ...camera,

                        status:
                            newStatus,

                        lastUpdate:
                            "Just now"

                    }

                    : camera

            )

        );

    };


    /*
    ============================================================
    OPEN CAMERA LIVE
    ============================================================
    */

    const viewCameraLive = (
        cameraId
    ) => {

        setPendingCameraId(
            cameraId
        );

        setActivePage(
            "cameras"
        );

    };


    /*
    ============================================================
    CLEAR PENDING CAMERA
    ============================================================
    */

    const clearPendingCamera = () => {

        setPendingCameraId(
            null
        );

    };


    /*
    ============================================================
    RECORD AI DETECTION
    ============================================================
    */

    const recordDetection = ({

        camera,

        className,

        confidence,

        snapshot,

        detectionCount = 1

    }) => {

        /*
        --------------------------------------------------------
        CHECK CAMERA
        --------------------------------------------------------
        */

        if (!camera) {

            console.error(
                "recordDetection: camera missing"
            );

            return;

        }


        /*
        --------------------------------------------------------
        NORMALIZE CLASS
        --------------------------------------------------------
        */

        const normalizedClass =
            String(
                className || ""
            )
                .toLowerCase()
                .trim();


        if (!normalizedClass) {

            return;

        }


        /*
        --------------------------------------------------------
        NORMALIZE CONFIDENCE
        --------------------------------------------------------

        YOLO may return:

        0.94

        OR

        94
        */

        let normalizedConfidence =
            Number(
                confidence
            );


        if (
            normalizedConfidence > 1
        ) {

            normalizedConfidence =
                normalizedConfidence / 100;

        }


        if (
            Number.isNaN(
                normalizedConfidence
            )
        ) {

            normalizedConfidence =
                0;

        }


        /*
        --------------------------------------------------------
        CURRENT TIME
        --------------------------------------------------------
        */

        const now =
            Date.now();


        const time =
            new Date(
                now
            ).toLocaleTimeString();


        /*
        ========================================================
        THREAT ENGINE
        ========================================================
        */

        const assessment =
            assessThreat({

                className:
                    normalizedClass,

                confidence:
                    normalizedConfidence,

                camera,

                detectionCount

            });


        /*
        ========================================================
        CREATE DETECTION ENTRY
        ========================================================

        Every YOLO scan is still saved here.

        This means Detection History can contain
        continuous AI detections.

        Only threats are deduplicated.
        */

        const entry = {

            id:
                `det-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,

            camera:
                camera.name,

            cameraId:
                camera.id,

            location:
                camera.location,

            zone:
                camera.zone,

            coverageRadius:
                camera.coverageRadius,

            className:
                normalizedClass,

            confidence:
                normalizedConfidence,

            snapshot,

            time,

            timestamp:
                now,

            detectionCount,

            severity:
                assessment.severity,

            priorityScore:
                assessment.priorityScore,

            isThreat:
                assessment.isThreat

        };


        /*
        SAVE DETECTION
        */

        setDetections((prev) =>

            [
                entry,
                ...prev
            ].slice(
                0,
                100
            )

        );


        /*
        ========================================================
        NON-THREAT OBJECT
        ========================================================
        */

        if (!assessment.isThreat) {

            console.log(
                `${normalizedClass} detected but is not a threat`
            );

            return;

        }


        /*
        ========================================================
        THREAT DUPLICATE KEY
        ========================================================

        Camera + object.

        Example:

        1-person
        1-car
        2-person

        Each gets its own threat stream.
        */

        const threatKey =
            `${camera.id}-${normalizedClass}`;


        /*
        ========================================================
        FIND EXISTING ACTIVE THREAT
        ========================================================
        */

        const existingThreat =
            threats.find(
                (threat) =>

                    threat.cameraId ===
                    camera.id &&

                    String(
                        threat.className || ""
                    )
                        .toLowerCase() ===
                    normalizedClass &&

                    threat.status ===
                    "ACTIVE"
            );


        /*
        ========================================================
        UPDATE EXISTING THREAT
        ========================================================

        IMPORTANT:

        If YOLO sees the same object again,
        don't create another threat.

        Instead update:

        - confidence
        - detection count
        - time
        - timestamp
        - snapshot
        - priority
        */

        if (existingThreat) {

            console.log(
                `Updating existing threat: ${threatKey}`
            );


            setThreats((prevThreats) =>

                prevThreats.map(
                    (threat) => {

                        if (
                            threat.id !==
                            existingThreat.id
                        ) {

                            return threat;

                        }


                        return {

                            ...threat,

                            confidence:
                                `${(
                                    normalizedConfidence *
                                    100
                                ).toFixed(1)}%`,

                            detectionCount:
                                (
                                    threat.detectionCount ||
                                    0
                                ) + 1,

                            time,

                            timestamp:
                                now,

                            priorityScore:
                                assessment.priorityScore,

                            severity:
                                assessment.severity,

                            description:
                                assessment.reason,

                            snapshot

                        };

                    }

                )

            );


            /*
            IMPORTANT:

            Do NOT create another incident.

            The existing incident correlation will continue
            from the original threat/detection.
            */

            return;

        }


        /*
        ========================================================
        CREATE NEW THREAT
        ========================================================
        */

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

            drone:
                "🚁",

            airplane:
                "✈️",

            bird:
                "🐦",

            dog:
                "🐕",

            cat:
                "🐈"

        };


        const newThreat = {

            id:
                nextThreatId.current++,

            title:
                assessment.title,

            camera:
                camera.name,

            cameraId:
                camera.id,

            location:
                camera.location,

            zone:
                camera.zone,

            /*
            VERY IMPORTANT

            Store className so future YOLO detections
            can identify this existing threat.
            */

            className:
                normalizedClass,

            severity:
                assessment.severity,

            priorityScore:
                assessment.priorityScore,

            confidence:
                `${(
                    normalizedConfidence *
                    100
                ).toFixed(1)}%`,

            detectionCount,

            time,

            timestamp:
                now,

            status:
                "ACTIVE",

            investigationStatus:
                "MONITORING",

            description:
                assessment.reason,

            icon:
                icons[
                    normalizedClass
                ] || "⚠",

            snapshot

        };


        /*
        ========================================================
        SAVE NEW THREAT
        ========================================================
        */

        setThreats((prev) =>

            [
                newThreat,
                ...prev
            ].slice(
                0,
                100
            )

        );


        /*
        ========================================================
        INCIDENT CORRELATION
        ========================================================
        */

        setIncidents((prevIncidents) => {

            const relatedIncident =
                findRelatedIncident(

                    prevIncidents,

                    entry,

                    camera

                );


            /*
            ----------------------------------------------------
            EXISTING INCIDENT
            ----------------------------------------------------
            */

            if (relatedIncident) {

                const updatedIncident =
                    updateIncident(

                        relatedIncident,

                        entry,

                        camera,

                        assessment

                    );


                return prevIncidents.map(
                    (incident) =>

                        incident.id ===
                        relatedIncident.id

                            ? updatedIncident

                            : incident

                );

            }


            /*
            ----------------------------------------------------
            CREATE NEW INCIDENT
            ----------------------------------------------------
            */

            const newIncident = {

                id:
                    `INC-${String(
                        nextIncidentId.current++
                    ).padStart(
                        4,
                        "0"
                    )}`,

                title:
                    assessment.title,

                severity:
                    assessment.severity,

                priorityScore:
                    assessment.priorityScore,

                status:
                    "ACTIVE",

                location:
                    camera.location,

                zones: [

                    camera.zone

                ],

                cameras: [

                    {

                        cameraId:
                            camera.id,

                        cameraName:
                            camera.name,

                        coverageRadius:
                            camera.coverageRadius,

                        latitude:
                            camera.latitude,

                        longitude:
                            camera.longitude

                    }

                ],

                detections: [

                    entry

                ],

                createdAt:
                    now,

                lastUpdated:
                    now,

                description:
                    assessment.reason

            };


            return [

                newIncident,

                ...prevIncidents

            ];

        });

    };


    /*
    ============================================================
    CAMERA STATISTICS
    ============================================================
    */

    const activeCameras =
        cameras.filter(
            (camera) =>
                camera.status ===
                "ACTIVE"
        );


    const warningCameras =
        cameras.filter(
            (camera) =>
                camera.status ===
                "WARNING"
        );


    const offlineCameras =
        cameras.filter(
            (camera) =>
                camera.status ===
                "OFFLINE"
        );


    /*
    ============================================================
    THREAT STATISTICS
    ============================================================
    */

    const activeThreats =
        threats.filter(
            (threat) =>
                threat.status ===
                "ACTIVE"
        );


    const criticalThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity ===
                "CRITICAL"
        );


    const highThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity ===
                "HIGH"
        );


    const mediumThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity ===
                "MEDIUM"
        );


    /*
    ============================================================
    PROVIDER VALUE
    ============================================================
    */

    const value = {

        cameras,

        threats,

        detections,

        incidents,


        acknowledgeThreat,

        updateCameraStatus,

        recordDetection,


        activeCameras,

        warningCameras,

        offlineCameras,


        activeThreats,

        criticalThreats,

        highThreats,

        mediumThreats,


        activePage,

        setActivePage,


        pendingCameraId,

        viewCameraLive,

        clearPendingCamera

    };


    return (

        <SurveillanceContext.Provider
            value={value}
        >

            {children}

        </SurveillanceContext.Provider>

    );

}


export function useSurveillance() {

    return useContext(
        SurveillanceContext
    );

}