CAMERAS = [
    {
        "id": "CAM-001",
        "name": "Camera 01",
        "zone": "NORTH",
        "latitude": 15.8497,
        "longitude": 74.4977,
        "coverageRadius": 500,
        "assignedOfficer": "OFFICER-001"
    },
    {
        "id": "CAM-002",
        "name": "Camera 02",
        "zone": "NORTH",
        "latitude": 15.8510,
        "longitude": 74.5000,
        "coverageRadius": 500,
        "assignedOfficer": "OFFICER-001"
    },
    {
        "id": "CAM-003",
        "name": "Camera 03",
        "zone": "EAST",
        "latitude": 15.8450,
        "longitude": 74.5100,
        "coverageRadius": 600,
        "assignedOfficer": "OFFICER-002"
    },
    {
        "id": "CAM-004",
        "name": "Camera 04",
        "zone": "WEST",
        "latitude": 15.8470,
        "longitude": 74.4850,
        "coverageRadius": 600,
        "assignedOfficer": "OFFICER-003"
    },
    {
        "id": "CAM-005",
        "name": "Camera 05",
        "zone": "SOUTH",
        "latitude": 15.8400,
        "longitude": 74.4980,
        "coverageRadius": 500,
        "assignedOfficer": "OFFICER-004"
    },
    {
        "id": "CAM-006",
        "name": "Camera 06",
        "zone": "SOUTH",
        "latitude": 15.8380,
        "longitude": 74.5050,
        "coverageRadius": 500,
        "assignedOfficer": "OFFICER-004"
    },
    {
        "id": "CAM-007",
        "name": "Camera 07",
        "zone": "NORTH",
        "latitude": 15.8550,
        "longitude": 74.4950,
        "coverageRadius": 700,
        "assignedOfficer": "OFFICER-005"
    },
    {
        "id": "CAM-008",
        "name": "Camera 08",
        "zone": "CENTRAL",
        "latitude": 15.8480,
        "longitude": 74.5020,
        "coverageRadius": 500,
        "assignedOfficer": "OFFICER-006"
    }
]


def get_camera(camera_id):

    for camera in CAMERAS:

        if camera["id"] == camera_id:
            return camera

    return None


def get_cameras_by_zone(zone):

    return [

        camera

        for camera in CAMERAS

        if camera["zone"] == zone.upper()

    ]