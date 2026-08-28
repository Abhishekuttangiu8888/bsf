from datetime import datetime


def create_alerts(camera, threat_analysis):

    alerts = []

    threats = threat_analysis.get("threats", [])

    for threat in threats:

        alert = {
            "alertId": f"ALERT-{datetime.now().strftime('%Y%m%d%H%M%S%f')}",

            "cameraId": camera["id"],

            "cameraName": camera["name"],

            "location": camera["location"],

            "sector": camera["sector"],

            "coverageRadius": camera["coverageRadius"],

            "assignedOfficer": camera["assignedOfficer"],

            "threatType": threat["type"],

            "severity": threat["severity"],

            "priorityScore": threat["priorityScore"],

            "title": threat["title"],

            "description": threat["description"],

            "status": "NEW",

            "createdAt": datetime.now().isoformat()
        }

        alerts.append(alert)

    return alerts