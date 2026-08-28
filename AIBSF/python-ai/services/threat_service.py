IGNORED_OBJECTS = [
    "bird",
    "cat",
    "dog",
    "sheep",
    "cow",
    "horse",
    "elephant",
    "bear"
]


VEHICLES = [
    "car",
    "truck",
    "bus",
    "motorcycle"
]


AERIAL_OBJECTS = [
    "drone",
    "airplane"
]


def assess_threat(
    class_name,
    confidence,
    detection_count=1
):

    object_name = class_name.lower()


    # ===============================
    # LOW CONFIDENCE DETECTION
    # ===============================

    if confidence < 0.60:

        return {
            "isThreat": False,
            "severity": "NONE",
            "priorityScore": 0,
            "title": "Low Confidence Detection",
            "reason": "Detection confidence is below 60%"
        }


    # ===============================
    # IGNORE ANIMALS
    # ===============================

    if object_name in IGNORED_OBJECTS:

        return {
            "isThreat": False,
            "severity": "NONE",
            "priorityScore": 0,
            "title": "Non-Threat Object",
            "reason": f"{class_name} detected but classified as non-threat"
        }


    # ===============================
    # PERSON / GROUP DETECTION
    # ===============================

    if object_name == "person":

        if detection_count >= 10:

            return {
                "isThreat": True,
                "severity": "CRITICAL",
                "priorityScore": 100,
                "title": "Large Group Movement Detected",
                "reason": f"{detection_count} persons detected simultaneously"
            }


        if detection_count >= 5:

            return {
                "isThreat": True,
                "severity": "HIGH",
                "priorityScore": 85,
                "title": "Suspicious Group Movement Detected",
                "reason": f"{detection_count} persons detected simultaneously"
            }


        if detection_count >= 2:

            return {
                "isThreat": True,
                "severity": "HIGH",
                "priorityScore": 70,
                "title": "Multiple Persons Detected",
                "reason": f"{detection_count} persons detected simultaneously"
            }


        return {
            "isThreat": True,
            "severity": "MEDIUM",
            "priorityScore": 50,
            "title": "Unauthorized Person Detected",
            "reason": "Single person detected in monitored area"
        }


    # ===============================
    # VEHICLE DETECTION
    # ===============================

    if object_name in VEHICLES:

        if object_name in ["truck", "bus"]:

            return {
                "isThreat": True,
                "severity": "CRITICAL",
                "priorityScore": 90,
                "title": "Large Vehicle Detected",
                "reason": f"{class_name} detected in restricted area"
            }


        return {
            "isThreat": True,
            "severity": "HIGH",
            "priorityScore": 75,
            "title": "Suspicious Vehicle Detected",
            "reason": f"{class_name} detected in restricted area"
        }


    # ===============================
    # AERIAL OBJECT
    # ===============================

    if object_name in AERIAL_OBJECTS:

        return {
            "isThreat": True,
            "severity": "HIGH",
            "priorityScore": 85,
            "title": "Possible Aerial Object Detected",
            "reason": f"{class_name} detected in monitored airspace"
        }


    # ===============================
    # UNKNOWN OBJECT
    # ===============================

    return {
        "isThreat": True,
        "severity": "LOW",
        "priorityScore": 30,
        "title": f"{class_name} Detected",
        "reason": "Unknown object requires monitoring"
    }