SEVERITY_ORDER = {
    "NONE": 0,
    "LOW": 1,
    "MEDIUM": 2,
    "HIGH": 3,
    "CRITICAL": 4
}


IGNORED_OBJECTS = {
    "bird",
    "cat",
    "dog",
    "sheep",
    "cow",
    "horse",
    "elephant",
    "bear"
}


def analyze_threats(
    detections,
    max_objects_in_single_frame
):

    threats = []

    ignored_objects = {}

    highest_severity = "NONE"


    def update_highest_severity(severity):

        nonlocal highest_severity

        if (
            SEVERITY_ORDER.get(severity, 0)
            >
            SEVERITY_ORDER.get(
                highest_severity,
                0
            )
        ):

            highest_severity = severity


    # CHECK EVERY DETECTED OBJECT

    for class_name, total_count in detections.items():

        object_name = class_name.lower()

        max_count = (
            max_objects_in_single_frame.get(
                class_name,
                0
            )
        )


        # IGNORE ANIMALS

        if object_name in IGNORED_OBJECTS:

            ignored_objects[class_name] = {
                "totalDetections": total_count,
                "maxInSingleFrame": max_count
            }

            continue


        # PERSON / GROUP DETECTION

        if object_name == "person":

            if max_count >= 10:

                severity = "CRITICAL"

                threat = {
                    "type": "LARGE_GROUP_MOVEMENT",
                    "severity": severity,
                    "priorityScore": 100,
                    "title": "Large Group Movement Detected",
                    "description": (
                        f"AI detected up to {max_count} "
                        "persons simultaneously in a single frame."
                    )
                }

                threats.append(threat)

                update_highest_severity(
                    severity
                )


            elif max_count >= 5:

                severity = "HIGH"

                threat = {
                    "type": "SUSPICIOUS_GROUP_MOVEMENT",
                    "severity": severity,
                    "priorityScore": 85,
                    "title": (
                        "Suspicious Group Movement Detected"
                    ),
                    "description": (
                        f"AI detected up to {max_count} "
                        "persons simultaneously in a single frame."
                    )
                }

                threats.append(threat)

                update_highest_severity(
                    severity
                )


            elif max_count >= 2:

                severity = "HIGH"

                threat = {
                    "type": "MULTIPLE_PERSONS",
                    "severity": severity,
                    "priorityScore": 70,
                    "title": (
                        "Multiple Persons Detected"
                    ),
                    "description": (
                        f"AI detected up to {max_count} "
                        "persons simultaneously."
                    )
                }

                threats.append(threat)

                update_highest_severity(
                    severity
                )


            elif max_count == 1:

                severity = "MEDIUM"

                threat = {
                    "type": "PERSON",
                    "severity": severity,
                    "priorityScore": 50,
                    "title": (
                        "Unauthorized Person Detected"
                    ),
                    "description": (
                        "AI detected one person in the "
                        "monitored area."
                    )
                }

                threats.append(threat)

                update_highest_severity(
                    severity
                )


        # VEHICLE DETECTION

        elif object_name in [
            "car",
            "motorcycle",
            "bicycle"
        ]:

            severity = "HIGH"

            threat = {
                "type": "VEHICLE",
                "severity": severity,
                "priorityScore": 75,
                "title": (
                    f"Suspicious Vehicle Detected: "
                    f"{class_name}"
                ),
                "description": (
                    f"AI detected up to {max_count} "
                    f"{class_name}(s) simultaneously."
                )
            }

            threats.append(threat)

            update_highest_severity(
                severity
            )


        # LARGE VEHICLES

        elif object_name in [
            "truck",
            "bus",
            "train"
        ]:

            severity = "CRITICAL"

            threat = {
                "type": "LARGE_VEHICLE",
                "severity": severity,
                "priorityScore": 90,
                "title": (
                    f"Large Vehicle Detected: "
                    f"{class_name}"
                ),
                "description": (
                    f"AI detected up to {max_count} "
                    f"{class_name}(s) simultaneously."
                )
            }

            threats.append(threat)

            update_highest_severity(
                severity
            )


        # AERIAL OBJECTS

        elif object_name in [
            "airplane",
            "drone"
        ]:

            severity = "HIGH"

            threat = {
                "type": "AERIAL_OBJECT",
                "severity": severity,
                "priorityScore": 85,
                "title": (
                    "Possible Aerial Object Detected"
                ),
                "description": (
                    f"AI detected up to {max_count} "
                    f"{class_name}(s) simultaneously."
                )
            }

            threats.append(threat)

            update_highest_severity(
                severity
            )


    return {

        "totalThreats": len(threats),

        "highestSeverity": highest_severity,

        "threats": threats,

        "ignoredObjects": ignored_objects,

        "maxPersonsInSingleFrame":

            max_objects_in_single_frame.get(
                "person",
                0
            )
    }