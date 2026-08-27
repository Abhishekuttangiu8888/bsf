import { useState } from "react";
import styles from "./Cameras.module.css";

function Cameras() {

    const [search, setSearch] = useState("");
    const [selectedCamera, setSelectedCamera] = useState(null);

    const cameras = [
        {
            id: 1,
            name: "Camera 01",
            location: "North Border Sector",
            status: "ACTIVE",
            lastUpdate: "Just now"
        },
        {
            id: 2,
            name: "Camera 02",
            location: "South Border Sector",
            status: "ACTIVE",
            lastUpdate: "1 min ago"
        },
        {
            id: 3,
            name: "Camera 03",
            location: "East Border Sector",
            status: "WARNING",
            lastUpdate: "2 min ago"
        },
        {
            id: 4,
            name: "Camera 04",
            location: "West Border Sector",
            status: "OFFLINE",
            lastUpdate: "18 min ago"
        },
        {
            id: 5,
            name: "Camera 05",
            location: "North-East Border Sector",
            status: "ACTIVE",
            lastUpdate: "Just now"
        },
        {
            id: 6,
            name: "Camera 06",
            location: "South-East Border Sector",
            status: "ACTIVE",
            lastUpdate: "3 min ago"
        },
        {
            id: 7,
            name: "Camera 07",
            location: "North-West Border Sector",
            status: "ACTIVE",
            lastUpdate: "1 min ago"
        },
        {
            id: 8,
            name: "Camera 08",
            location: "Central Border Sector",
            status: "WARNING",
            lastUpdate: "4 min ago"
        }
    ];


    const filteredCameras = cameras.filter((camera) =>
        camera.name.toLowerCase().includes(search.toLowerCase()) ||
        camera.location.toLowerCase().includes(search.toLowerCase())
    );


    const activeCount = cameras.filter(
        (camera) => camera.status === "ACTIVE"
    ).length;

    const warningCount = cameras.filter(
        (camera) => camera.status === "WARNING"
    ).length;

    const offlineCount = cameras.filter(
        (camera) => camera.status === "OFFLINE"
    ).length;


    return (
        <div className={styles.cameras}>

            {/* ================= TOP ================= */}

            <div className={styles.top}>

                <div>

                    <h2>CAMERA MANAGEMENT</h2>

                    <p>
                        Monitor and manage all border surveillance cameras
                    </p>

                </div>

                <div className={styles.systemStatus}>
                    ● CAMERA SYSTEM ONLINE
                </div>

            </div>


            {/* ================= SUMMARY ================= */}

            <div className={styles.summary}>

                <div className={styles.summaryCard}>

                    <span>TOTAL CAMERAS</span>

                    <strong>{cameras.length}</strong>

                    <p>
                        Surveillance units
                    </p>

                </div>


                <div className={styles.summaryCard}>

                    <span>ACTIVE</span>

                    <strong className={styles.green}>
                        {activeCount}
                    </strong>

                    <p>
                        Cameras operational
                    </p>

                </div>


                <div className={styles.summaryCard}>

                    <span>WARNING</span>

                    <strong className={styles.yellow}>
                        {warningCount}
                    </strong>

                    <p>
                        Require attention
                    </p>

                </div>


                <div className={styles.summaryCard}>

                    <span>OFFLINE</span>

                    <strong className={styles.red}>
                        {offlineCount}
                    </strong>

                    <p>
                        Cameras unavailable
                    </p>

                </div>

            </div>


            {/* ================= TOOLBAR ================= */}

            <div className={styles.toolbar}>

                <div>

                    <h3>ALL CAMERAS</h3>

                    <p>
                        {filteredCameras.length} cameras found
                    </p>

                </div>


                <div className={styles.searchBox}>

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search camera or location..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

            </div>


            {/* ================= CAMERA TABLE ================= */}

            <div className={styles.tableContainer}>

                <div className={styles.tableHeader}>

                    <span>CAMERA</span>
                    <span>LOCATION</span>
                    <span>STATUS</span>
                    <span>LAST UPDATE</span>
                    <span>ACTION</span>

                </div>


                {
                    filteredCameras.map((camera) => (

                        <div
                            className={styles.cameraRow}
                            key={camera.id}
                        >

                            <div className={styles.cameraName}>

                                <div className={styles.cameraIcon}>
                                    📹
                                </div>

                                <div>
                                    <strong>
                                        {camera.name}
                                    </strong>

                                    <small>
                                        ID: CAM-{String(camera.id).padStart(3, "0")}
                                    </small>
                                </div>

                            </div>


                            <div className={styles.location}>
                                📍 {camera.location}
                            </div>


                            <div>

                                <span
                                    className={
                                        camera.status === "ACTIVE"
                                            ? styles.active
                                            : camera.status === "WARNING"
                                                ? styles.warning
                                                : styles.offline
                                    }
                                >
                                    ● {camera.status}
                                </span>

                            </div>


                            <div className={styles.lastUpdate}>
                                {camera.lastUpdate}
                            </div>


                            <div>

                                <button
                                    className={styles.viewButton}
                                    onClick={() =>
                                        setSelectedCamera(camera)
                                    }
                                >
                                    VIEW
                                </button>

                            </div>

                        </div>

                    ))

                }


                {
                    filteredCameras.length === 0 && (

                        <div className={styles.noResults}>
                            No cameras found
                        </div>

                    )
                }

            </div>


            {/* ================= CAMERA DETAILS ================= */}

            {
                selectedCamera && (

                    <div
                        className={styles.overlay}
                        onClick={() =>
                            setSelectedCamera(null)
                        }
                    >

                        <div
                            className={styles.details}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <button
                                className={styles.close}
                                onClick={() =>
                                    setSelectedCamera(null)
                                }
                            >
                                ✕
                            </button>


                            <div className={styles.preview}>

                                <span>
                                    ● LIVE PREVIEW
                                </span>

                                <div>
                                    CAMERA FEED
                                </div>

                            </div>


                            <h2>
                                {selectedCamera.name}
                            </h2>


                            <p className={styles.detailLocation}>
                                📍 {selectedCamera.location}
                            </p>


                            <div className={styles.detailStatus}>

                                <span>
                                    STATUS
                                </span>

                                <strong
                                    className={
                                        selectedCamera.status === "ACTIVE"
                                            ? styles.green
                                            : selectedCamera.status === "WARNING"
                                                ? styles.yellow
                                                : styles.red
                                    }
                                >
                                    ● {selectedCamera.status}
                                </strong>

                            </div>


                            <div className={styles.detailStatus}>

                                <span>
                                    LAST UPDATE
                                </span>

                                <strong>
                                    {selectedCamera.lastUpdate}
                                </strong>

                            </div>


                            <button
                                className={styles.fullButton}
                            >
                                OPEN LIVE SURVEILLANCE
                            </button>

                        </div>

                    </div>

                )
            }

        </div>
    );
}

export default Cameras;