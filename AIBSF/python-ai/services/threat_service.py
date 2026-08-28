def analyze_threat(
    detections,
    max_objects_in_single_frame,
    total_frames
):

    threats = []

    ignored_objects = {}


    # =====================================
    # IGNORED OBJECTS
    # =====================================

    ignored_classes = [

        "bird",

        "cat",

        "dog",

        "sheep",

        "cow",

        "horse",

        "elephant",

        "bear"

    ]


    for object_name in ignored_classes:

        if object_name in detections:

            ignored_objects[
                object_name
            ] = detections[
                object_name
            ]


    # =====================================
    # PERSON / GROUP / LARGE ARMY
    # =====================================

    person_count = (
        max_objects_in_single_frame.get(
            "person",
            0
        )
    )


    if person_count >= 10:

        threats.append({

            "type":
                "LARGE_GROUP_MOVEMENT",

            "severity":
                "CRITICAL",

            "priorityScore":
                100,

            "title":
                "Possible Large Group Movement Detected",

            "description":

                f"AI detected up to "
                f"{person_count} persons "
                f"simultaneously in a single frame."

        })


    elif person_count >= 5:

        threats.append({

            "type":
                "SUSPICIOUS_GROUP_MOVEMENT",

            "severity":
                "HIGH",

            "priorityScore":
                85,

            "title":
                "Suspicious Group Movement Detected",

            "description":

                f"AI detected up to "
                f"{person_count} persons "
                f"simultaneously in a single frame."

        })


    elif person_count >= 2:

        threats.append({

            "type":
                "MULTIPLE_PERSONS",

            "severity":
                "HIGH",

            "priorityScore":
                70,

            "title":
                "Multiple Persons Detected",

            "description":

                f"AI detected "
                f"{person_count} persons "
                f"simultaneously."

        })


    elif person_count == 1:

        threats.append({

            "type":
                "PERSON",

            "severity":
                "MEDIUM",

            "priorityScore":
                50,

            "title":
                "Unauthorized Person Detected",

            "description":

                "One person was detected "
                "inside the monitored area."

        })


    # =====================================
    # VEHICLE DETECTION
    # =====================================

    vehicle_classes = [

        "car",

        "motorcycle",

        "bus",

        "truck",

        "train"

    ]


    for vehicle in vehicle_classes:

        vehicle_count = (
            max_objects_in_single_frame.get(
                vehicle,
                0
            )
        )


        if vehicle_count == 0:

            continue


        # Large vehicles

        if vehicle in [

            "bus",

            "truck",

            "train"

        ]:

            severity = "CRITICAL"

            priority_score = 90

            title = (
                f"Large Vehicle Detected: "
                f"{vehicle}"
            )

        else:

            severity = "HIGH"

            priority_score = 75

            title = (
                f"Suspicious Vehicle Detected: "
                f"{vehicle}"
            )


        threats.append({

            "type":
                "LARGE_VEHICLE"
                if vehicle in [
                    "bus",
                    "truck",
                    "train"
                ]
                else "VEHICLE",

            "severity":
                severity,

            "priorityScore":
                priority_score,

            "title":
                title,

            "description":

                f"AI detected up to "
                f"{vehicle_count} "
                f"{vehicle}(s) "
                f"simultaneously."

        })


    # =====================================
    # AERIAL OBJECT DETECTION
    # =====================================

    aerial_classes = [

        "drone",

        "airplane",

        "helicopter"

    ]


    for aerial_object in aerial_classes:

        aerial_count = (
            max_objects_in_single_frame.get(
                aerial_object,
                0
            )
        )


        if aerial_count > 0:

            threats.append({

                "type":
                    "AERIAL_OBJECT",

                "severity":
                    "HIGH",

                "priorityScore":
                    85,

                "title":
                    "Possible Aerial Object Detected",

                "description":

                    f"AI detected "
                    f"{aerial_count} "
                    f"{aerial_object}(s) "
                    f"simultaneously."

            })


    # =====================================
    # FIND HIGHEST SEVERITY
    # =====================================

    severity_order = {

        "LOW": 1,

        "MEDIUM": 2,

        "HIGH": 3,

        "CRITICAL": 4

    }


    highest_severity = "NONE"


    if threats:

        highest_threat = max(

            threats,

            key=lambda threat:

                severity_order.get(
                    threat["severity"],
                    0
                )

        )


        highest_severity = (
            highest_threat[
                "severity"
            ]
        )


    # =====================================
    # RETURN FINAL ANALYSIS
    # =====================================

    return {

        "totalThreats":
            len(threats),

        "highestSeverity":
            highest_severity,

        "threats":
            threats,

        "ignoredObjects":
            ignored_objects,

        "maxPersonsInSingleFrame":
            person_count

    }