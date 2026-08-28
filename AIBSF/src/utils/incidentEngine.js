/*
    INCIDENT CORRELATION ENGINE

    Connects detections from different cameras
    when they appear to belong to the same incident.
*/


/*
    Find a related incident
*/

export function findRelatedIncident(
    incidents,
    detection,
    camera
) {

    if (!incidents || incidents.length === 0) {
        return null;
    }


    const now =
        Date.now();


    /*
        Incidents are considered related when:

        1. They happened recently
        2. They involve the same detection class
        3. They are in the same or nearby zone
    */

    const INCIDENT_TIME_WINDOW =
        5 * 60 * 1000;


    for (const incident of incidents) {

        const timeDifference =
            now - incident.lastUpdated;


        /*
            Ignore old incidents
        */

        if (
            timeDifference >
            INCIDENT_TIME_WINDOW
        ) {

            continue;

        }


        /*
            Check zone relationship
        */

        const sameZone =
            incident.zones?.includes(
                camera.zone
            );


        /*
            Check detection class
        */

        const sameClass =
            incident.detections?.some(
                (item) =>
                    String(item.className).toLowerCase() ===
                    String(detection.className).toLowerCase()
            );


        /*
            Same zone + same object
        */

        if (
            sameZone &&
            sameClass
        ) {

            return incident;

        }

    }


    return null;

}


/*
    UPDATE EXISTING INCIDENT
*/

export function updateIncident(
    incident,
    detection,
    camera,
    assessment
) {

    /*
        Add detection
    */

    const updatedDetections = [

        detection,

        ...(incident.detections || [])

    ].slice(0, 100);


    /*
        Add camera if not already present
    */

    const existingCamera =
        (incident.cameras || []).some(
            (item) =>
                item.cameraId === camera.id
        );


    const updatedCameras =
        existingCamera

            ? incident.cameras

            : [

                ...(incident.cameras || []),

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
        Add zone if not already present
    */

    const existingZone =
        (incident.zones || []).includes(
            camera.zone
        );


    const updatedZones =
        existingZone

            ? incident.zones

            : [

                ...(incident.zones || []),

                camera.zone

            ];


    /*
        Keep the highest severity
    */

    const severityRank = {

        MEDIUM: 1,

        HIGH: 2,

        CRITICAL: 3

    };


    const currentRank =
        severityRank[
            incident.severity
        ] || 1;


    const newRank =
        severityRank[
            assessment.severity
        ] || 1;


    const finalSeverity =
        newRank > currentRank

            ? assessment.severity

            : incident.severity;


    /*
        Keep highest priority score
    */

    const finalPriorityScore =
        Math.max(

            incident.priorityScore || 0,

            assessment.priorityScore || 0

        );


    /*
        Return updated incident
    */

    return {

        ...incident,

        severity:
            finalSeverity,

        priorityScore:
            finalPriorityScore,

        status:
            "ACTIVE",

        cameras:
            updatedCameras,

        zones:
            updatedZones,

        detections:
            updatedDetections,

        lastUpdated:
            Date.now(),

        description:
            assessment.reason

    };

}