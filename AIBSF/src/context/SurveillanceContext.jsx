import { createContext, useContext, useState } from "react";

const SurveillanceContext = createContext();

const initialCameras = [
{
id: 1,
name: "Camera 01",
location: "North Border Sector",
status: "ACTIVE",
lastUpdate: "Just now",
x: "20%",
y: "25%"
},
{
id: 2,
name: "Camera 02",
location: "South Border Sector",
status: "ACTIVE",
lastUpdate: "1 min ago",
x: "35%",
y: "72%"
},
{
id: 3,
name: "Camera 03",
location: "East Border Sector",
status: "WARNING",
lastUpdate: "2 min ago",
x: "78%",
y: "35%"
},
{
id: 4,
name: "Camera 04",
location: "West Border Sector",
status: "OFFLINE",
lastUpdate: "18 min ago",
x: "18%",
y: "55%"
},
{
id: 5,
name: "Camera 05",
location: "North-East Border Sector",
status: "ACTIVE",
lastUpdate: "Just now",
x: "62%",
y: "20%"
},
{
id: 6,
name: "Camera 06",
location: "South-East Border Sector",
status: "ACTIVE",
lastUpdate: "3 min ago",
x: "70%",
y: "75%"
},
{
id: 7,
name: "Camera 07",
location: "North-West Border Sector",
status: "ACTIVE",
lastUpdate: "1 min ago",
x: "40%",
y: "15%"
},
{
id: 8,
name: "Camera 08",
location: "Central Border Sector",
status: "WARNING",
lastUpdate: "4 min ago",
x: "50%",
y: "50%"
}
];

const initialThreats = [
{
id: 1,
title: "Unauthorized Movement",
camera: "Camera 03",
location: "East Border Sector",
severity: "CRITICAL",
confidence: "94.7%",
time: "12:45:32",
status: "ACTIVE",
investigationStatus: "INVESTIGATING",
description:
"AI detected unauthorized movement within the restricted border zone.",
icon: "⚠",
x: "58%",
y: "45%"
},
{
id: 2,
title: "Suspicious Vehicle",
camera: "Camera 07",
location: "North Border Sector",
severity: "HIGH",
confidence: "89.3%",
time: "12:42:18",
status: "ACTIVE",
investigationStatus: "MONITORING",
description:
"A suspicious vehicle was detected moving near the restricted surveillance area.",
icon: "🚗",
x: "72%",
y: "55%"
},
{
id: 3,
title: "Unknown Person Detected",
camera: "Camera 12",
location: "West Border Sector",
severity: "MEDIUM",
confidence: "82.6%",
time: "12:38:45",
status: "ACTIVE",
investigationStatus: "MONITORING",
description:
"An unidentified person was detected inside the monitored zone.",
icon: "👤"
},
{
id: 4,
title: "Object Left Behind",
camera: "Camera 09",
location: "South Border Sector",
severity: "MEDIUM",
confidence: "78.9%",
time: "12:34:21",
status: "ACTIVE",
investigationStatus: "MONITORING",
description:
"AI detected an unattended object near the surveillance perimeter.",
icon: "📦"
}
];

export function SurveillanceProvider({ children }) {

 
const [cameras, setCameras] = useState(initialCameras);

const [threats, setThreats] = useState(initialThreats);


const acknowledgeThreat = (id) => {

    setThreats(
        threats.map((threat) =>
            threat.id === id
                ? {
                    ...threat,
                    status: "ACKNOWLEDGED"
                }
                : threat
        )
    );
};


const updateCameraStatus = (id, newStatus) => {

    setCameras(
        cameras.map((camera) =>
            camera.id === id
                ? {
                    ...camera,
                    status: newStatus,
                    lastUpdate: "Just now"
                }
                : camera
        )
    );
};


const activeCameras = cameras.filter(
    (camera) => camera.status === "ACTIVE"
);

const warningCameras = cameras.filter(
    (camera) => camera.status === "WARNING"
);

const offlineCameras = cameras.filter(
    (camera) => camera.status === "OFFLINE"
);


const activeThreats = threats.filter(
    (threat) => threat.status === "ACTIVE"
);

const criticalThreats = activeThreats.filter(
    (threat) => threat.severity === "CRITICAL"
);

const highThreats = activeThreats.filter(
    (threat) => threat.severity === "HIGH"
);

const mediumThreats = activeThreats.filter(
    (threat) => threat.severity === "MEDIUM"
);


const value = {

    cameras,
    threats,

    acknowledgeThreat,
    updateCameraStatus,

    activeCameras,
    warningCameras,
    offlineCameras,

    activeThreats,
    criticalThreats,
    highThreats,
    mediumThreats
};


return (

    <SurveillanceContext.Provider value={value}>

        {children}

    </SurveillanceContext.Provider>

);


}

export function useSurveillance() {


return useContext(SurveillanceContext);


}
