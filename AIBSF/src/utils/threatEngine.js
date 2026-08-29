/*
============================================================
THREAT ASSESSMENT ENGINE
============================================================

Converts YOLO AI detections into security threat information.

YOLO tells us:
    - What object was detected
    - Confidence of detection
    - Number of detected objects

This engine converts that information into:
    - Threat / Non-threat
    - Severity
    - Priority score
    - Threat title
    - Explanation
============================================================
*/


export function assessThreat({

    className,

    confidence,

    camera,

    detectionCount = 1

}) {


    /*
    ============================================================
    NORMALIZE OBJECT CLASS
    ============================================================
    */

    const objectClass =

        String(className || "")
            .toLowerCase()
            .trim();


    /*
    ============================================================
    NORMALIZE CONFIDENCE
    ============================================================

    YOLO may return:

        0.956

    OR

        95.6

    We convert both to:

        0.956
    */

    let normalizedConfidence =
        Number(confidence || 0);


    if (normalizedConfidence > 1) {

        normalizedConfidence =
            normalizedConfidence / 100;

    }


    /*
    Prevent invalid confidence values
    */

    if (
        Number.isNaN(normalizedConfidence)
    ) {

        normalizedConfidence = 0;

    }


    /*
    Keep confidence between 0 and 1
    */

    normalizedConfidence =
        Math.max(
            0,
            Math.min(
                normalizedConfidence,
                1
            )
        );


    /*
    ============================================================
    SUPPORTED YOLO OBJECTS
    ============================================================
    */

    const threatObjects = [

        "person",

        "car",

        "truck",

        "bus",

        "motorcycle",

        "bicycle",

        "drone",

        "airplane"

    ];


    /*
    ============================================================
    IGNORE UNSUPPORTED OBJECTS
    ============================================================
    */

    if (
        !threatObjects.includes(
            objectClass
        )
    ) {

        return {

            isThreat: false,

            severity: "LOW",

            priorityScore: 0,

            title: "Non-Threat Detection",

            reason:
                `${className || "Object"} is not classified as a security threat.`,

            confidence:
                normalizedConfidence

        };

    }


    /*
    ============================================================
    CONFIDENCE SCORE
    ============================================================
    */

    const confidenceScore =
        normalizedConfidence * 100;


    /*
    ============================================================
    MULTIPLE OBJECT BONUS
    ============================================================

    More objects in one frame can increase
    the priority slightly.

    Maximum bonus = 20
    */

    const safeDetectionCount =
        Math.max(
            1,
            Number(detectionCount) || 1
        );


    const detectionScore =
        Math.min(
            safeDetectionCount * 5,
            20
        );


    /*
    ============================================================
    CAMERA STATUS BONUS
    ============================================================
    */

    let cameraBonus = 0;


    /*
    WARNING camera

    Detection becomes slightly more important.
    */

    if (
        camera?.status === "WARNING"
    ) {

        cameraBonus = 5;

    }


    /*
    ============================================================
    BASE PRIORITY SCORE
    ============================================================
    */

    let priorityScore =

        confidenceScore +

        detectionScore +

        cameraBonus;


    /*
    Limit score between 0 and 100
    */

    priorityScore =
        Math.min(
            Math.round(priorityScore),
            100
        );


    /*
    ============================================================
    DETERMINE THREAT SEVERITY
    ============================================================
    */

    let severity = "LOW";


    /*
    ------------------------------------------------------------
    PERSON
    ------------------------------------------------------------

    Person detections are treated more carefully.

    < 70%  = LOW
    70-84% = MEDIUM
    85-94% = HIGH
    >=95%  = CRITICAL
    */

    if (
        objectClass === "person"
    ) {

        if (
            normalizedConfidence >= 0.95
        ) {

            severity = "CRITICAL";

        }

        else if (
            normalizedConfidence >= 0.85
        ) {

            severity = "HIGH";

        }

        else if (
            normalizedConfidence >= 0.70
        ) {

            severity = "MEDIUM";

        }

        else {

            severity = "LOW";

        }

    }


    /*
    ------------------------------------------------------------
    VEHICLES
    ------------------------------------------------------------

    Vehicle detections:

    < 75%  = LOW
    75-89% = MEDIUM
    90-94% = HIGH
    >=95%  = CRITICAL
    */

    else if (

        objectClass === "car" ||

        objectClass === "truck" ||

        objectClass === "bus" ||

        objectClass === "motorcycle" ||

        objectClass === "bicycle"

    ) {

        if (
            normalizedConfidence >= 0.95
        ) {

            severity = "CRITICAL";

        }

        else if (
            normalizedConfidence >= 0.90
        ) {

            severity = "HIGH";

        }

        else if (
            normalizedConfidence >= 0.75
        ) {

            severity = "MEDIUM";

        }

        else {

            severity = "LOW";

        }

    }


    /*
    ------------------------------------------------------------
    DRONE / AIRPLANE
    ------------------------------------------------------------

    Aircraft are considered more sensitive
    in a border-security environment.

    < 70%  = LOW
    70-84% = MEDIUM
    85-94% = HIGH
    >=95%  = CRITICAL
    */

    else if (

        objectClass === "drone" ||

        objectClass === "airplane"

    ) {

        if (
            normalizedConfidence >= 0.95
        ) {

            severity = "CRITICAL";

        }

        else if (
            normalizedConfidence >= 0.85
        ) {

            severity = "HIGH";

        }

        else if (
            normalizedConfidence >= 0.70
        ) {

            severity = "MEDIUM";

        }

        else {

            severity = "LOW";

        }

    }


    /*
    ============================================================
    LOW THREAT HANDLING
    ============================================================
    */

    /*
    Low-confidence detections are not considered
    actionable threats.

    They can still be saved in Detection History,
    but they will not create a threat alert.
    */

    if (
        severity === "LOW"
    ) {

        return {

            isThreat: false,

            severity: "LOW",

            priorityScore,

            title:
                "Low Confidence Detection",

            reason:
                `AI detected ${className || "an object"} near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence. Confidence is below the threat threshold.`,

            confidence:
                normalizedConfidence

        };

    }


    /*
    ============================================================
    THREAT TITLES
    ============================================================
    */

    const titles = {

        person:
            "Unauthorized Movement",

        car:
            "Suspicious Vehicle",

        truck:
            "Suspicious Vehicle",

        bus:
            "Suspicious Vehicle",

        motorcycle:
            "Suspicious Motorcycle",

        bicycle:
            "Suspicious Movement",

        drone:
            "Unauthorized Drone",

        airplane:
            "Unauthorized Aircraft"

    };


    const title =

        titles[objectClass] ||

        "Suspicious Activity";


    /*
    ============================================================
    THREAT DESCRIPTION
    ============================================================
    */

    let reason = "";


    if (
        objectClass === "person"
    ) {

        reason =
            `AI detected a person near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence. The detection requires security monitoring.`;

    }


    else if (

        objectClass === "car" ||

        objectClass === "truck" ||

        objectClass === "bus"

    ) {

        reason =
            `AI detected a ${objectClass} near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence. The vehicle requires security monitoring.`;

    }


    else if (
        objectClass === "motorcycle"
    ) {

        reason =
            `AI detected a motorcycle near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence.`;

    }


    else if (
        objectClass === "bicycle"
    ) {

        reason =
            `AI detected a bicycle near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence.`;

    }


    else if (
        objectClass === "drone"
    ) {

        reason =
            `AI detected a drone near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence. Possible unauthorized aerial activity requires attention.`;

    }


    else if (
        objectClass === "airplane"
    ) {

        reason =
            `AI detected an aircraft near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence. Aerial activity requires monitoring.`;

    }


    else {

        reason =
            `AI detected ${className || "an object"} near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence.`;

    }


    /*
    ============================================================
    RETURN FINAL THREAT ASSESSMENT
    ============================================================
    */

    return {

        isThreat: true,

        severity,

        priorityScore,

        title,

        reason,

        confidence:
            normalizedConfidence

    };

}