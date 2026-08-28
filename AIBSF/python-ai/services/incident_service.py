from datetime import datetime, timedelta
from config.camera_config import get_camera


class IncidentService:

    def __init__(self):

        # Stores active incidents temporarily in memory
        self.active_incidents = {}

        # Time window for combining detections
        self.correlation_window = timedelta(seconds=60)


    def create_or_update_incident(
        self,
        camera_id,
        threat_analysis
    ):

        camera = get_camera(camera_id)

        if not camera:
            return {
                "success": False,
                "message": "Camera not found"
            }


        now = datetime.now()


        # Create an incident key based on zone.
        # Cameras in the same zone can initially
        # be correlated into the same incident.
        incident_key = camera["zone"]


        existing_incident = (
            self.active_incidents.get(
                incident_key
            )
        )


        # Check whether an existing incident is
        # still inside the correlation time window.

        if existing_incident:

            last_updated = (
                existing_incident["lastUpdated"]
            )

            time_difference = (
                now - last_updated
            )


            if (
                time_difference
                <= self.correlation_window
            ):

                return self._update_incident(
                    existing_incident,
                    camera,
                    threat_analysis,
                    now
                )


        # Otherwise create a new incident.

        return self._create_incident(
            incident_key,
            camera,
            threat_analysis,
            now
        )


    def _create_incident(
        self,
        incident_key,
        camera,
        threat_analysis,
        now
    ):

        incident = {

            "incidentId":

                f"INC-{now.strftime('%Y%m%d%H%M%S')}",


            "zone":

                camera["zone"],


            "status":

                "ACTIVE",


            "severity":

                threat_analysis[
                    "highestSeverity"
                ],


            "totalThreats":

                threat_analysis[
                    "totalThreats"
                ],


            "cameras":

                [camera["id"]],


            "cameraNames":

                [camera["name"]],


            "assignedOfficer":

                camera[
                    "assignedOfficer"
                ],


            "createdAt":

                now.isoformat(),


            "lastUpdated":

                now,


            "evidence": [

                {
                    "cameraId":

                        camera["id"],


                    "cameraName":

                        camera["name"],


                    "detectedAt":

                        now.isoformat(),


                    "threats":

                        threat_analysis[
                            "threats"
                        ]

                }

            ]

        }


        self.active_incidents[
            incident_key
        ] = incident


        return {

            "success": True,

            "action":

                "CREATED",

            "incident":

                self._serialize_incident(
                    incident
                )

        }


    def _update_incident(
        self,
        incident,
        camera,
        threat_analysis,
        now
    ):

        # Add camera if it is not already
        # part of this incident.

        if (
            camera["id"]
            not in incident["cameras"]
        ):

            incident[
                "cameras"
            ].append(
                camera["id"]
            )

            incident[
                "cameraNames"
            ].append(
                camera["name"]
            )


        # Update the highest severity.

        severity_order = {

            "LOW": 1,

            "MEDIUM": 2,

            "HIGH": 3,

            "CRITICAL": 4

        }


        current_severity = (
            incident["severity"]
        )

        new_severity = (
            threat_analysis[
                "highestSeverity"
            ]
        )


        if (
            severity_order.get(
                new_severity,
                0
            )

            >

            severity_order.get(
                current_severity,
                0
            )
        ):

            incident[
                "severity"
            ] = new_severity


        # Add new threats.

        incident[
            "totalThreats"
        ] += threat_analysis[
            "totalThreats"
        ]


        # Store evidence.

        incident[
            "evidence"
        ].append(

            {

                "cameraId":

                    camera["id"],


                "cameraName":

                    camera["name"],


                "detectedAt":

                    now.isoformat(),


                "threats":

                    threat_analysis[
                        "threats"
                    ]

            }

        )


        incident[
            "lastUpdated"
        ] = now


        return {

            "success": True,

            "action":

                "UPDATED",

            "incident":

                self._serialize_incident(
                    incident
                )

        }


    def _serialize_incident(
        self,
        incident
    ):

        return {

            **incident,

            "lastUpdated":

                incident[
                    "lastUpdated"
                ].isoformat()

        }


# Create one shared instance

incident_service = IncidentService()