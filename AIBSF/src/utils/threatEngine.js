/*
    THREAT ASSESSMENT ENGINE

    Converts AI detections into security threat information.
*/

export function assessThreat({
    className,
    confidence,
    camera,
    detectionCount = 1
}) {

    const objectClass =
        String(className || "").toLowerCase();

    const score =
        Number(confidence || 0);

    /*
        Confidence may come as:
        0.94
        OR
        94
    */

    const normalizedConfidence =
        score > 1
            ? score / 100
            : score;


    /*
        THREAT OBJECTS

        These objects are considered relevant
        for border-security monitoring.
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
        Ignore unsupported detections
    */

    if (!threatObjects.includes(objectClass)) {

        return {
            isThreat: false,
            severity: "LOW",
            priorityScore: 0,
            title: "Non-Threat Detection",
            reason: `${className} is not classified as a security threat.`
        };

    }


    /*
        Calculate priority score

        Confidence = 0 - 100
        Detection count increases priority
    */

    const confidenceScore =
        normalizedConfidence * 100;

    const detectionScore =
        Math.min(detectionCount * 5, 20);


    let priorityScore =
        confidenceScore + detectionScore;


    /*
        Camera warning/offline conditions
    */

    if (camera?.status === "WARNING") {
        priorityScore += 5;
    }


    /*
        Limit score
    */

    priorityScore =
        Math.min(Math.round(priorityScore), 100);


    /*
        Determine severity
    */

    let severity = "MEDIUM";


    if (
        priorityScore >= 90 ||
        (
            objectClass === "person" &&
            normalizedConfidence >= 0.90
        )
    ) {

        severity = "CRITICAL";

    } else if (
        priorityScore >= 75 ||
        normalizedConfidence >= 0.85
    ) {

        severity = "HIGH";

    } else {

        severity = "MEDIUM";

    }


    /*
        Threat title
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
        Explanation
    */

    const reason =
        `AI detected ${className} near ${camera?.location || "the monitored border zone"} with ${(normalizedConfidence * 100).toFixed(1)}% confidence.`;


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