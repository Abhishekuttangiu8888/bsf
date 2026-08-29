import {
    useState,
    useEffect
} from "react";

import styles from "./Cameras.module.css";

import {
    useSurveillance
} from "../context/SurveillanceContext";


function Cameras() {

    const {
        cameras,
        pendingCameraId,
        clearPendingCamera
    } = useSurveillance();


    const [search, setSearch] =
        useState("");


    const [
        selectedCamera,
        setSelectedCamera
    ] = useState(null);


    /*
    ============================================================
    AUTOMATICALLY OPEN CAMERA
    WHEN COMING FROM ALERTS / OTHER PAGES
    ============================================================
    */

    useEffect(() => {

        if (!pendingCameraId) {

            return;

        }


        const camera =
            cameras.find(
                (camera) =>
                    Number(camera.id) ===
                    Number(pendingCameraId)
            );


        if (camera) {

            setSelectedCamera(camera);

        }


        clearPendingCamera();

    }, [
        pendingCameraId,
        cameras,
        clearPendingCamera
    ]);


    /*
    ============================================================
    CAMERA VIDEO
    ============================================================
    
    Camera 01 → camera1.mp4
    Camera 02 → camera2.mp4
    ...
    Camera 08 → camera8.mp4
    ============================================================
    */

    const getVideo = (cameraId) => {

        const videos = [

            "/videos/camera1.mp4",

            "/videos/camera2.mp4",

            "/videos/camera3.mp4",

            "/videos/camera4.mp4",

            "/videos/camera5.mp4",

            "/videos/camera6.mp4",

            "/videos/camera7.mp4",

            "/videos/camera8.mp4"

        ];


        const index =
            Number(cameraId) - 1;


        if (
            index < 0 ||
            index >= videos.length
        ) {

            return videos[0];

        }


        return videos[index];

    };


    /*
    ============================================================
    SEARCH CAMERAS
    ============================================================
    */

    const filteredCameras =
        cameras.filter(
            (camera) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                if (!searchText) {

                    return true;

                }


                return (

                    camera.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    camera.location
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(camera.id)
                        .includes(searchText)

                );

            }
        );


    /*
    ============================================================
    CAMERA COUNTS
    ============================================================
    */

    const activeCount =
        cameras.filter(
            (camera) =>
                camera.status === "ACTIVE"
        ).length;


    const warningCount =
        cameras.filter(
            (camera) =>
                camera.status === "WARNING"
        ).length;


    const offlineCount =
        cameras.filter(
            (camera) =>
                camera.status === "OFFLINE"
        ).length;


    /*
    ============================================================
    CLOSE CAMERA MODAL
    ============================================================
    */

    const closeCamera = () => {

        setSelectedCamera(null);

    };


    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div
            className={styles.cameras}
        >

            {/* ==================================================
                TOP HEADER
            ================================================== */}

            <div
                className={styles.top}
            >

                <div>

                    <h2>
                        CAMERA MANAGEMENT
                    </h2>

                    <p>
                        Monitor and manage all border surveillance cameras
                    </p>

                </div>


                <div
                    className={styles.systemStatus}
                >

                    ● CAMERA SYSTEM ONLINE

                </div>

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div
                className={styles.summary}
            >

                {/* TOTAL */}

                <div
                    className={styles.summaryCard}
                >

                    <span>
                        TOTAL CAMERAS
                    </span>

                    <strong>
                        {cameras.length}
                    </strong>

                    <p>
                        Surveillance units
                    </p>

                </div>


                {/* ACTIVE */}

                <div
                    className={styles.summaryCard}
                >

                    <span>
                        ACTIVE
                    </span>

                    <strong
                        className={styles.green}
                    >
                        {activeCount}
                    </strong>

                    <p>
                        Cameras operational
                    </p>

                </div>


                {/* WARNING */}

                <div
                    className={styles.summaryCard}
                >

                    <span>
                        WARNING
                    </span>

                    <strong
                        className={styles.yellow}
                    >
                        {warningCount}
                    </strong>

                    <p>
                        Require attention
                    </p>

                </div>


                {/* OFFLINE */}

                <div
                    className={styles.summaryCard}
                >

                    <span>
                        OFFLINE
                    </span>

                    <strong
                        className={styles.red}
                    >
                        {offlineCount}
                    </strong>

                    <p>
                        Cameras unavailable
                    </p>

                </div>

            </div>


            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div
                className={styles.toolbar}
            >

                <div>

                    <h3>
                        ALL CAMERAS
                    </h3>

                    <p>
                        {filteredCameras.length} cameras found
                    </p>

                </div>


                {/* SEARCH */}

                <div
                    className={styles.searchBox}
                >

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search camera or location..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* ==================================================
                CAMERA TABLE
            ================================================== */}

            <div
                className={styles.tableContainer}
            >

                {/* TABLE HEADER */}

                <div
                    className={styles.tableHeader}
                >

                    <span>
                        CAMERA
                    </span>

                    <span>
                        LOCATION
                    </span>

                    <span>
                        STATUS
                    </span>

                    <span>
                        LAST UPDATE
                    </span>

                    <span>
                        ACTION
                    </span>

                </div>


                {/* CAMERA ROWS */}

                {filteredCameras.map(
                    (camera) => (

                        <div
                            className={styles.cameraRow}
                            key={camera.id}
                        >

                            {/* CAMERA */}

                            <div
                                className={styles.cameraName}
                            >

                                <div
                                    className={styles.cameraIcon}
                                >

                                    📹

                                </div>


                                <div>

                                    <strong>
                                        {camera.name}
                                    </strong>

                                    <small>

                                        ID: CAM-

                                        {String(
                                            camera.id
                                        ).padStart(
                                            3,
                                            "0"
                                        )}

                                    </small>

                                </div>

                            </div>


                            {/* LOCATION */}

                            <div
                                className={styles.location}
                            >

                                📍 {camera.location}

                            </div>


                            {/* STATUS */}

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


                            {/* LAST UPDATE */}

                            <div
                                className={styles.lastUpdate}
                            >

                                {camera.lastUpdate}

                            </div>


                            {/* ACTION */}

                            <div>

                                <button
                                    className={styles.viewButton}
                                    onClick={() =>
                                        setSelectedCamera(
                                            camera
                                        )
                                    }
                                >

                                    VIEW

                                </button>

                            </div>

                        </div>

                    )
                )}


                {/* NO RESULTS */}

                {filteredCameras.length === 0 && (

                    <div
                        className={styles.noResults}
                    >

                        No cameras found

                    </div>

                )}

            </div>


            {/* ==================================================
                CAMERA DETAILS MODAL
            ================================================== */}

            {selectedCamera && (

                <div
                    className={styles.overlay}
                    onClick={closeCamera}
                >

                    <div
                        className={styles.details}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* CLOSE */}

                        <button
                            className={styles.close}
                            onClick={closeCamera}
                        >

                            ✕

                        </button>


                        {/* ==================================================
                            LIVE VIDEO
                        ================================================== */}

                        <div
                            className={styles.preview}
                        >

                            <video
                                key={selectedCamera.id}
                                src={
                                    getVideo(
                                        selectedCamera.id
                                    )
                                }
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                            />


                            <span
                                className={styles.previewLive}
                            >

                                ● LIVE PREVIEW

                            </span>

                        </div>


                        {/* ==================================================
                            CAMERA NAME
                        ================================================== */}

                        <h2>

                            {selectedCamera.name}

                        </h2>


                        {/* LOCATION */}

                        <p
                            className={
                                styles.detailLocation
                            }
                        >

                            📍 {selectedCamera.location}

                        </p>


                        {/* ==================================================
                            STATUS
                        ================================================== */}

                        <div
                            className={
                                styles.detailStatus
                            }
                        >

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


                        {/* ==================================================
                            LAST UPDATE
                        ================================================== */}

                        <div
                            className={
                                styles.detailStatus
                            }
                        >

                            <span>
                                LAST UPDATE
                            </span>


                            <strong>

                                {selectedCamera.lastUpdate}

                            </strong>

                        </div>


                        {/* ==================================================
                            CAMERA ID
                        ================================================== */}

                        <div
                            className={
                                styles.detailStatus
                            }
                        >

                            <span>
                                CAMERA ID
                            </span>


                            <strong>

                                CAM-

                                {String(
                                    selectedCamera.id
                                ).padStart(
                                    3,
                                    "0"
                                )}

                            </strong>

                        </div>


                        {/* ==================================================
                            ZONE
                        ================================================== */}

                        {selectedCamera.zone && (

                            <div
                                className={
                                    styles.detailStatus
                                }
                            >

                                <span>
                                    ZONE
                                </span>


                                <strong>

                                    {selectedCamera.zone}

                                </strong>

                            </div>

                        )}


                        {/* ==================================================
                            CLOSE
                        ================================================== */}

                        <button
                            className={
                                styles.fullButton
                            }
                            onClick={closeCamera}
                        >

                            CLOSE CAMERA

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Cameras;