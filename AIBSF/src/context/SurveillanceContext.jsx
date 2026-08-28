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


const SurveillanceContext =
    createContext();


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


const initialThreats = [

    {
        id: 1,
        title: "Unauthorized Movement",
        camera: "Camera 03",
        cameraId: 3,
        location: "East Border Sector",
        severity: "CRITICAL",
        confidence: "94.7%",
        time: "12:45:32",
        status: "ACTIVE",
        investigationStatus: "INVESTIGATING",

        description:
            "AI detected unauthorized movement within the restricted border zone.",

        icon: "⚠",

        x: "58%",
        y: "45%"
    },

    {
        id: 2,
        title: "Suspicious Vehicle",
        camera: "Camera 07",
        cameraId: 7,
        location: "North Border Sector",
        severity: "HIGH",
        confidence: "89.3%",
        time: "12:42:18",
        status: "ACTIVE",
        investigationStatus: "MONITORING",

        description:
            "A suspicious vehicle was detected moving near the restricted surveillance area.",

        icon: "🚗",

        x: "72%",
        y: "55%"
    },

    {
        id: 3,
        title: "Unknown Person Detected",
        camera: "Camera 04",
        cameraId: 4,
        location: "West Border Sector",
        severity: "MEDIUM",
        confidence: "82.6%",
        time: "12:38:45",
        status: "ACTIVE",
        investigationStatus: "MONITORING",

        description:
            "An unidentified person was detected inside the monitored zone.",

        icon: "👤"
    },

    {
        id: 4,
        title: "Object Left Behind",
        camera: "Camera 02",
        cameraId: 2,
        location: "South Border Sector",
        severity: "MEDIUM",
        confidence: "78.9%",
        time: "12:34:21",
        status: "ACTIVE",
        investigationStatus: "MONITORING",

        description:
            "AI detected an unattended object near the surveillance perimeter.",

        icon: "📦"
    }

];


export function SurveillanceProvider({
    children
}) {

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


    const nextThreatId =
        useRef(initialThreats.length + 1);

    const nextIncidentId =
        useRef(1);


    /*
    PREVENT DUPLICATE DETECTIONS
    */

    const recentDetectionRef =
        useRef({});


    /*
    ACKNOWLEDGE THREAT
    AND UPDATE RELATED INCIDENT
    */

    const acknowledgeThreat = (id) => {

        setThreats((prevThreats) => {

            const updatedThreats =
                prevThreats.map((threat) =>

                    threat.id === id

                        ? {
                            ...threat,
                            status: "ACKNOWLEDGED",
                            investigationStatus: "ACKNOWLEDGED"
                        }

                        : threat
                );


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
                        incident.detections.some(
                            (detection) =>

                                detection.cameraId ===
                                acknowledgedThreat?.cameraId
                        );


                    if (!isRelatedIncident) {

                        return incident;

                    }


                    /*
                    FIND ALL THREATS
                    RELATED TO INCIDENT CAMERAS
                    */

                    const relatedThreats =
                        updatedThreats.filter(
                            (threat) =>

                                incident.cameras.some(
                                    (camera) =>

                                        camera.cameraId ===
                                        threat.cameraId
                                )
                        );


                    /*
                    CHECK WHETHER ALL RELATED
                    THREATS ARE ACKNOWLEDGED
                    */

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
    UPDATE CAMERA STATUS
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
                        status: newStatus,
                        lastUpdate: "Just now"
                    }
                    : camera
            )
        );

    };


    /*
    OPEN CAMERA LIVE
    */

    const viewCameraLive = (
        cameraId
    ) => {

        setPendingCameraId(cameraId);

        setActivePage("cameras");

    };


    /*
    CLEAR PENDING CAMERA
    */

    const clearPendingCamera = () => {

        setPendingCameraId(null);

    };


    /*
    RECORD AI DETECTION
    */

    const recordDetection = ({

        camera,

        className,

        confidence,

        snapshot,

        detectionCount = 1

    }) => {

        const time =
            new Date().toLocaleTimeString();

        const now =
            Date.now();


        /*
        ANALYZE THREAT
        */

        const assessment =
            assessThreat({

                className,

                confidence,

                camera,

                detectionCount

            });


        /*
        IGNORE NON-THREATS
        */

        if (!assessment.isThreat) {

            console.log(
                `${className} ignored: ${assessment.reason}`
            );

            return;

        }


        /*
        PREVENT DUPLICATE DETECTIONS
        */

        const detectionKey =
            `${camera.id}-${className.toLowerCase()}`;


        const lastDetection =
            recentDetectionRef.current[
                detectionKey
            ] || 0;


        const DUPLICATE_COOLDOWN =
            60000;


        if (
            now - lastDetection <
            DUPLICATE_COOLDOWN
        ) {

            console.log(
                `Duplicate ${className} ignored for ${camera.name}`
            );

            return;

        }


        recentDetectionRef.current[
            detectionKey
        ] = now;


        /*
        CREATE DETECTION ENTRY
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

            className,

            confidence,

            snapshot,

            time,

            timestamp:
                now,

            detectionCount,

            severity:
                assessment.severity,

            priorityScore:
                assessment.priorityScore

        };


        /*
        SAVE DETECTION
        */

        setDetections((prev) =>
            [entry, ...prev].slice(0, 100)
        );


        /*
        ICON MAP
        */

        const icons = {

            person: "👤",

            car: "🚗",

            truck: "🚛",

            bus: "🚌",

            motorcycle: "🏍️",

            bicycle: "🚲",

            drone: "🚁",

            airplane: "✈️"

        };


        /*
        CREATE INDIVIDUAL THREAT
        */

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

            severity:
                assessment.severity,

            priorityScore:
                assessment.priorityScore,

            confidence:

                `${(
                    confidence * 100
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
                    className.toLowerCase()
                ] || "⚠",

            snapshot

        };


        /*
        SAVE THREAT
        */

        setThreats((prev) =>
            [newThreat, ...prev]
        );


        /*
        MULTI-CAMERA
        INCIDENT CORRELATION
        */

        setIncidents((prevIncidents) => {

            const relatedIncident =
                findRelatedIncident(

                    prevIncidents,

                    entry,

                    camera

                );


            /*
            RELATED INCIDENT FOUND
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
            CREATE NEW INCIDENT
            */

            const newIncident = {

                id:

                    `INC-${String(
                        nextIncidentId.current++
                    ).padStart(4, "0")}`,


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
    CAMERA STATISTICS
    */

    const activeCameras =
        cameras.filter(
            (camera) =>
                camera.status === "ACTIVE"
        );


    const warningCameras =
        cameras.filter(
            (camera) =>
                camera.status === "WARNING"
        );


    const offlineCameras =
        cameras.filter(
            (camera) =>
                camera.status === "OFFLINE"
        );


    /*
    THREAT STATISTICS
    */

    const activeThreats =
        threats.filter(
            (threat) =>
                threat.status === "ACTIVE"
        );


    const criticalThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity === "CRITICAL"
        );


    const highThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity === "HIGH"
        );


    const mediumThreats =
        activeThreats.filter(
            (threat) =>
                threat.severity === "MEDIUM"
        );


    /*
    SHARE DATA WITH
    ENTIRE APPLICATION
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