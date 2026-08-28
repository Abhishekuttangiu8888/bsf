const CORRELATION_TIME_WINDOW = 2 * 60 * 1000;

// Maximum distance between cameras that can
// belong to the same incident.
const MAX_CAMERA_DISTANCE_KM = 3;


/*
CALCULATE DISTANCE BETWEEN TWO CAMERAS
*/

function getDistanceInKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;

    const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
        ((lon2 - lon1) * Math.PI) / 180;


    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(
            (lat1 * Math.PI) / 180
        )

        *

        Math.cos(
            (lat2 * Math.PI) / 180
        )

        *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


/*
CHECK WHETHER A NEW DETECTION
BELONGS TO AN EXISTING INCIDENT
*/

export function findRelatedIncident(
    incidents,
    detection,
    camera
) {

    const now =
        detection.timestamp;


    for (const incident of incidents) {

        /*
        DO NOT ADD DETECTIONS
        TO RESOLVED INCIDENTS
        */

        if (
            incident.status === "RESOLVED"
        ) {
            continue;
        }


        /*
        CHECK TIME WINDOW
        */

        const timeDifference =

            Math.abs(
                now -
                incident.lastUpdated
            );


        if (
            timeDifference >
            CORRELATION_TIME_WINDOW
        ) {
            continue;
        }


        /*
        CHECK DISTANCE BETWEEN
        NEW CAMERA AND CAMERAS
        ALREADY INSIDE THE INCIDENT
        */

        for (
            const incidentCamera
            of incident.cameras
        ) {

            /*
            Safety check in case old incident
            data does not contain coordinates.
            */

            if (
                incidentCamera.latitude == null ||
                incidentCamera.longitude == null
            ) {
                continue;
            }


            const distance =

                getDistanceInKm(

                    camera.latitude,
                    camera.longitude,

                    incidentCamera.latitude,
                    incidentCamera.longitude

                );


            if (
                distance <=
                MAX_CAMERA_DISTANCE_KM
            ) {

                return incident;

            }

        }

    }


    return null;

}


/*
UPDATE AN EXISTING INCIDENT
WITH A NEW DETECTION
*/

export function updateIncident(
    incident,
    detection,
    camera,
    assessment
) {

    /*
    CHECK WHETHER THIS CAMERA
    IS ALREADY PART OF THE INCIDENT
    */

    const cameraAlreadyExists =

        incident.cameras.some(

            (item) =>

                item.cameraId ===
                camera.id

        );


    /*
    ADD CAMERA ONLY IF IT
    DOES NOT ALREADY EXIST
    */

    const updatedCameras =

        cameraAlreadyExists

            ? incident.cameras

            : [

                ...incident.cameras,

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

            ];


    /*
    CHECK WHETHER THE ZONE
    IS ALREADY PART OF INCIDENT
    */

    const existingZones =
        incident.zones || [];


    const zoneAlreadyExists =

        existingZones.includes(
            camera.zone
        );


    const updatedZones =

        zoneAlreadyExists

            ? existingZones

            : [

                ...existingZones,

                camera.zone

            ];


    /*
    KEEP THE HIGHEST SEVERITY
    */

    const updatedSeverity =

        getHigherSeverity(

            incident.severity,

            assessment.severity

        );


    /*
    KEEP THE HIGHEST
    PRIORITY SCORE
    */

    const updatedPriorityScore =

        Math.max(

            incident.priorityScore,

            assessment.priorityScore

        );


    /*
    ADD NEW DETECTION
    */

    const updatedDetections = [

        detection,

        ...incident.detections

    ];


    return {

        ...incident,

        severity:
            updatedSeverity,

        priorityScore:
            updatedPriorityScore,

        cameras:
            updatedCameras,

        zones:
            updatedZones,

        detections:
            updatedDetections,

        lastUpdated:
            detection.timestamp,

        description:

            `${updatedCameras.length} camera(s) ` +

            `reported related activity across ` +

            `${updatedZones.length} zone(s).`

    };

}


/*
COMPARE SEVERITY LEVELS
AND RETURN THE HIGHER ONE
*/

function getHigherSeverity(
    first,
    second
) {

    const severityLevels = {

        LOW: 1,

        MEDIUM: 2,

        HIGH: 3,

        CRITICAL: 4

    };


    return severityLevels[second] >
        severityLevels[first]

        ? second

        : first;

}