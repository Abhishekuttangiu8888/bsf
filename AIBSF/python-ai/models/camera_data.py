CAMERAS = {
    "CAM-01": {
        "id": "CAM-01",
        "name": "North Border Camera 01",
        "location": "North Border Sector",
        "sector": "SECTOR-A",
        "coverageRadius": 500,
        "latitude": 15.1234,
        "longitude": 76.1234,
        "assignedOfficer": "OFFICER-01"
    },

    "CAM-02": {
        "id": "CAM-02",
        "name": "East Border Camera 02",
        "location": "East Border Sector",
        "sector": "SECTOR-B",
        "coverageRadius": 750,
        "latitude": 15.2345,
        "longitude": 76.2345,
        "assignedOfficer": "OFFICER-02"
    },

    "CAM-03": {
        "id": "CAM-03",
        "name": "South Border Camera 03",
        "location": "South Border Sector",
        "sector": "SECTOR-C",
        "coverageRadius": 1000,
        "latitude": 15.3456,
        "longitude": 76.3456,
        "assignedOfficer": "OFFICER-03"
    }
}


def get_camera(camera_id):
    return CAMERAS.get(camera_id)