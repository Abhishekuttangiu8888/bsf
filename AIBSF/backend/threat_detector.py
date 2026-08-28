from typing import Dict, List, Any
from datetime import datetime


# ============================================================
# THREAT DETECTOR CONFIGURATION
# ============================================================

THREAT_LEVELS = {
    "LOW": 1,
    "MEDIUM": 2,
    "HIGH": 3,
    "CRITICAL": 4
}


# Objects that can be treated as vehicles
VEHICLE_CLASSES = {
    "car",
    "truck",
    "bus",
    "motorcycle"
}


# ============================================================
# THREAT DETECTOR
# ============================================================

class ThreatDetector:

    def __init__(self):

        print("----------------------------------------")
        print("THREAT DETECTOR")
        print("----------------------------------------")
        print("Threat detection engine initialized")
        print("Status: ONLINE")


    # ========================================================
    # ANALYZE SINGLE DETECTION
    # ========================================================

    def analyze_detection(
        self,
        detection: Dict[str, Any]
    ) -> Dict[str, Any]:

        class_name = str(
            detection.get("className", "")
        ).lower()

        confidence = float(
            detection.get("confidence", 0)
        )


        # ----------------------------------------------------
        # PERSON
        # ----------------------------------------------------

        if class_name == "person":

            if confidence >= 0.85:

                threat_level = "HIGH"
                threat_score = 80
                reason = "Person detected with high confidence"

            elif confidence >= 0.60:

                threat_level = "MEDIUM"
                threat_score = 55
                reason = "Person detected"

            else:

                threat_level = "LOW"
                threat_score = 30
                reason = "Possible person detected"


        # ----------------------------------------------------
        # VEHICLE
        # ----------------------------------------------------

        elif class_name in VEHICLE_CLASSES:

            if confidence >= 0.85:

                threat_level = "MEDIUM"
                threat_score = 50
                reason = f"Vehicle detected: {class_name}"

            else:

                threat_level = "LOW"
                threat_score = 25
                reason = f"Possible vehicle detected: {class_name}"


        # ----------------------------------------------------
        # OTHER OBJECT
        # ----------------------------------------------------

        else:

            threat_level = "LOW"
            threat_score = 15
            reason = f"Object detected: {class_name}"


        return {

            "threatLevel": threat_level,

            "threatScore": threat_score,

            "reason": reason,

            "object": class_name,

            "confidence": confidence,

            "confidencePercent": round(
                confidence * 100,
                1
            )

        }


    # ========================================================
    # ANALYZE ALL DETECTIONS
    # ========================================================

    def analyze(
        self,
        detections: List[Dict[str, Any]]
    ) -> Dict[str, Any]:

        threats = []


        for detection in detections:

            threat = self.analyze_detection(
                detection
            )

            threats.append(threat)


        # ----------------------------------------------------
        # FIND HIGHEST THREAT
        # ----------------------------------------------------

        highest_level = "LOW"
        highest_score = 0


        for threat in threats:

            level = threat["threatLevel"]

            score = THREAT_LEVELS.get(
                level,
                1
            )


            if score > highest_score:

                highest_score = score
                highest_level = level


        # ----------------------------------------------------
        # ALERT DECISION
        # ----------------------------------------------------

        alert_required = (
            highest_level in {
                "HIGH",
                "CRITICAL"
            }
        )


        return {

            "success": True,

            "threatLevel": highest_level,

            "alertRequired": alert_required,

            "threatCount": len(threats),

            "threats": threats

        }


    # ========================================================
    # CREATE ALERT
    # ========================================================

    def create_alert(
        self,
        analysis: Dict[str, Any],
        camera_id: Any = None,
        camera_name: str = "Unknown Camera",
        location: str = "Unknown Location"
    ) -> Dict[str, Any]:

        if not analysis.get("alertRequired"):

            return {

                "alertCreated": False,

                "alert": None

            }


        threat_level = analysis.get(
            "threatLevel",
            "LOW"
        )


        # ----------------------------------------------------
        # ALERT TITLE
        # ----------------------------------------------------

        if threat_level == "CRITICAL":

            title = "CRITICAL SECURITY THREAT"

        elif threat_level == "HIGH":

            title = "HIGH PRIORITY THREAT"

        else:

            title = "SECURITY ALERT"


        # ----------------------------------------------------
        # CREATE ALERT
        # ----------------------------------------------------

        alert = {

            "id": (
                f"ALERT-"
                f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
            ),

            "title": title,

            "level": threat_level,

            "cameraId": camera_id,

            "cameraName": camera_name,

            "location": location,

            "message": self._build_message(
                analysis
            ),

            "threatCount": analysis.get(
                "threatCount",
                0
            ),

            "threats": analysis.get(
                "threats",
                []
            ),

            "timestamp": datetime.now().isoformat(),

            "status": "ACTIVE"

        }


        return {

            "alertCreated": True,

            "alert": alert

        }


    # ========================================================
    # BUILD ALERT MESSAGE
    # ========================================================

    def _build_message(
        self,
        analysis: Dict[str, Any]
    ) -> str:

        threats = analysis.get(
            "threats",
            []
        )


        if not threats:

            return "Security threat detected"


        first_threat = threats[0]


        object_name = first_threat.get(
            "object",
            "unknown object"
        )


        confidence = first_threat.get(
            "confidencePercent",
            0
        )


        return (
            f"{object_name.upper()} detected "
            f"with {confidence}% confidence"
        )


    # ========================================================
    # COMPLETE PROCESS
    # ========================================================

    def process_detections(
        self,
        detections: List[Dict[str, Any]],
        camera_id: Any = None,
        camera_name: str = "Unknown Camera",
        location: str = "Unknown Location"
    ) -> Dict[str, Any]:

        analysis = self.analyze(
            detections
        )


        alert_result = self.create_alert(
            analysis=analysis,
            camera_id=camera_id,
            camera_name=camera_name,
            location=location
        )


        return {

            "success": True,

            "analysis": analysis,

            "alertCreated":
                alert_result["alertCreated"],

            "alert":
                alert_result["alert"]

        }


# ============================================================
# GLOBAL THREAT DETECTOR
# ============================================================

threat_detector = ThreatDetector()


# ============================================================
# HELPER FUNCTION
# ============================================================

def analyze_threats(
    detections: List[Dict[str, Any]]
) -> Dict[str, Any]:

    return threat_detector.analyze(
        detections
    )


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print(" THREAT DETECTOR TEST")
    print("========================================")


    test_detections = [

        {

            "className": "person",

            "classId": 0,

            "confidence": 0.94,

            "confidencePercent": 94.0,

            "box": {

                "x1": 40,

                "y1": 20,

                "x2": 400,

                "y2": 700

            }

        }

    ]


    result = threat_detector.process_detections(

        detections=test_detections,

        camera_id=1,

        camera_name="Camera 01",

        location="North Border Sector"

    )


    print()
    print("Threat analysis:")
    print(result)

    print()
    print("========================================")
    print(" THREAT DETECTOR TEST COMPLETE")
    print("========================================")