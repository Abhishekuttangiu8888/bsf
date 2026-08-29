import {
    useEffect,
    useRef,
    useState
} from "react";

import styles from "./LiveSurveillance.module.css";

import {
    useSurveillance
} from "../context/SurveillanceContext";

import {
    checkYOLOHealth,
    detectFrame
} from "../utils/yoloApi";


function LiveSurveillance() {

    const {
        cameras,
        activeCameras,
        recordDetection
    } = useSurveillance();


    // ========================================================
    // ENLARGED CAMERA
    // ========================================================

    const [
        enlargedCamera,
        setEnlargedCamera
    ] = useState(null);


    // ========================================================
    // YOLO CONNECTION
    // ========================================================

    const [
        yoloStatus,
        setYoloStatus
    ] = useState("CHECKING");


    const [
        yoloDetails,
        setYoloDetails
    ] = useState(null);


    // ========================================================
    // DETECTION RESULTS
    // ========================================================

    const [
        detectionResults,
        setDetectionResults
    ] = useState({});


    // ========================================================
    // VIDEO REFERENCES
    // ========================================================

    const videoRefs =
        useRef({});


    // ========================================================
    // DETECTION LOCK
    // ========================================================

    const detectingRef =
        useRef({});


    // ========================================================
    // CAMERA REF
    // ========================================================

    /*
    Keep the latest cameras available to the
    detection interval without recreating the
    interval every time camera state changes.
    */

    const camerasRef =
        useRef(cameras);


    useEffect(() => {

        camerasRef.current =
            cameras;

    }, [cameras]);


    // ========================================================
    // CAMERA VIDEOS
    // ========================================================

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


        return videos[
            (cameraId - 1) %
            videos.length
        ];

    };


    // ========================================================
    // CAMERA STATUS CLASS
    // ========================================================

    const statusClass = (status) => {

        if (status === "ACTIVE") {

            return styles.active;

        }


        if (status === "WARNING") {

            return styles.warning;

        }


        return styles.offline;

    };


    // ========================================================
    // CHECK YOLO BACKEND
    // ========================================================

    const checkBackend = async () => {

        console.log(
            "Checking YOLO backend..."
        );


        setYoloStatus(
            "CHECKING"
        );


        try {

            const result =
                await checkYOLOHealth();


            console.log(
                "YOLO backend:",
                result
            );


            setYoloDetails(
                result
            );


            if (

                result &&

                result.success === true &&

                result.backend === "ONLINE" &&

                result.yolo === "LOADED" &&

                result.threatEngine === "ONLINE"

            ) {

                setYoloStatus(
                    "ONLINE"
                );

            } else {

                setYoloStatus(
                    "OFFLINE"
                );

            }

        } catch (error) {

            console.error(
                "YOLO backend check failed:",
                error
            );


            setYoloStatus(
                "OFFLINE"
            );

        }

    };


    // ========================================================
    // INITIAL BACKEND CHECK
    // ========================================================

    useEffect(() => {

        checkBackend();


        const interval =
            setInterval(
                checkBackend,
                10000
            );


        return () => {

            clearInterval(
                interval
            );

        };

    }, []);


    // ========================================================
    // CAPTURE VIDEO FRAME
    // ========================================================

    const captureVideoFrame = (
        cameraId
    ) => {

        const video =
            videoRefs.current[
                cameraId
            ];


        if (!video) {

            console.log(
                `Camera ${cameraId}: video element not ready`
            );

            return null;

        }


        if (
            video.readyState <
            HTMLMediaElement.HAVE_CURRENT_DATA
        ) {

            console.log(
                `Camera ${cameraId}: video data not ready`
            );

            return null;

        }


        if (
            !video.videoWidth ||
            !video.videoHeight
        ) {

            console.log(
                `Camera ${cameraId}: video dimensions unavailable`
            );

            return null;

        }


        try {

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                video.videoWidth;


            canvas.height =
                video.videoHeight;


            const context =
                canvas.getContext(
                    "2d"
                );


            if (!context) {

                console.error(
                    `Camera ${cameraId}: canvas context unavailable`
                );

                return null;

            }


            context.drawImage(

                video,

                0,

                0,

                canvas.width,

                canvas.height

            );


            const imageBase64 =
                canvas.toDataURL(
                    "image/jpeg",
                    0.75
                );


            return imageBase64;

        } catch (error) {

            console.error(

                `Camera ${cameraId}: frame capture failed`,

                error

            );


            return null;

        }

    };


    // ========================================================
    // RUN YOLO DETECTION
    // ========================================================

    const runDetection = async (
        camera
    ) => {

        if (
            yoloStatus !==
            "ONLINE"
        ) {

            return;

        }


        if (!camera) {

            return;

        }


        const cameraId =
            camera.id;


        // ----------------------------------------------------
        // PREVENT OVERLAPPING REQUESTS
        // ----------------------------------------------------

        if (
            detectingRef.current[
                cameraId
            ]
        ) {

            console.log(

                `Camera ${cameraId}: detection already running`

            );


            return;

        }


        // ----------------------------------------------------
        // CAPTURE CURRENT FRAME
        // ----------------------------------------------------

        const imageBase64 =
            captureVideoFrame(
                cameraId
            );


        if (!imageBase64) {

            console.warn(

                `Camera ${cameraId}: unable to capture frame`

            );


            return;

        }


        // ----------------------------------------------------
        // LOCK CAMERA
        // ----------------------------------------------------

        detectingRef.current[
            cameraId
        ] = true;


        try {

            console.log(

                `Camera ${cameraId}: sending frame to YOLO...`

            );


            // =================================================
            // SEND FRAME TO YOLO
            // =================================================

            const result =
                await detectFrame({

                    image:
                        imageBase64,

                    confidence:
                        0.35,

                    cameraId:
                        camera.id,

                    cameraName:
                        camera.name,

                    location:
                        camera.location

                });


            console.log(

                `Camera ${cameraId}: YOLO result`,

                result

            );


            // =================================================
            // SUCCESSFUL YOLO RESULT
            // =================================================

            if (

                result &&

                result.success === true

            ) {

                // ---------------------------------------------
                // UPDATE LIVE CAMERA RESULT
                // ---------------------------------------------

                setDetectionResults(
                    previous => ({

                        ...previous,

                        [cameraId]: {

                            detections:
                                result.detections ||
                                [],

                            detectionCount:
                                result.detectionCount ||
                                0,

                            classes:
                                result.classes ||
                                {},

                            threat:
                                result.threat ||
                                null,

                            alertCreated:
                                result.alertCreated ||
                                false,

                            alert:
                                result.alert ||
                                null,

                            lastDetection:
                                new Date()
                                    .toLocaleTimeString()

                        }

                    })
                );


                // =================================================
                // SEND YOLO DETECTIONS TO GLOBAL CONTEXT
                // =================================================

                /*
                This is the IMPORTANT CHANGE.

                Every object detected by YOLO is now sent
                to SurveillanceContext.

                SurveillanceContext decides whether it is
                a threat and whether an existing threat
                should be updated or a new one created.
                */

                const detections =
                    result.detections || [];


                detections.forEach(
                    (detection) => {

                        const className =

                            detection.className ||

                            detection.class_name ||

                            detection.class ||

                            "";


                        if (!className) {

                            return;

                        }


                        let confidence =

                            detection.confidence;


                        /*
                        Some YOLO responses may provide:

                        confidence = 0.956

                        or

                        confidence = 95.6

                        */

                        if (

                            confidence ===
                            undefined ||

                            confidence ===
                            null

                        ) {

                            confidence =
                                detection.confidencePercent;

                        }


                        if (

                            confidence ===
                            undefined ||

                            confidence ===
                            null

                        ) {

                            confidence = 0;

                        }


                        confidence =
                            Number(
                                confidence
                            );


                        if (
                            Number.isNaN(
                                confidence
                            )
                        ) {

                            confidence = 0;

                        }


                        /*
                        If confidence is percentage,
                        convert it to decimal.
                        */

                        if (
                            confidence > 1
                        ) {

                            confidence =
                                confidence / 100;

                        }


                        // -----------------------------------------
                        // RECORD GLOBAL DETECTION
                        // -----------------------------------------

                        recordDetection({

                            camera,

                            className,

                            confidence,

                            snapshot:
                                imageBase64,

                            detectionCount:
                                result.detectionCount ||
                                detections.length ||
                                1

                        });

                    }

                );


                console.log(

                    `Camera ${cameraId}: global detection state updated`

                );

            } else {

                console.warn(

                    `Camera ${cameraId}: YOLO returned unsuccessful result`,

                    result

                );

            }

        } catch (error) {

            console.error(

                `Camera ${cameraId}: YOLO detection error`,

                error

            );

        } finally {

            detectingRef.current[
                cameraId
            ] = false;

        }

    };


    // ========================================================
    // RUN DETECTION EVERY 3 SECONDS
    // ========================================================

    useEffect(() => {

        if (
            yoloStatus !==
            "ONLINE"
        ) {

            return;

        }


        if (
            !camerasRef.current ||
            camerasRef.current.length === 0
        ) {

            return;

        }


        // ----------------------------------------------------
        // FIRST DETECTION
        // ----------------------------------------------------

        const initialTimers = [];


        camerasRef.current.forEach(
            (camera, index) => {

                /*
                Stagger the first requests slightly.

                This prevents all cameras from hitting
                the backend at exactly the same moment.
                */

                const timer =
                    setTimeout(

                        () => {

                            runDetection(
                                camera
                            );

                        },

                        500 +
                        (index * 150)

                    );


                initialTimers.push(
                    timer
                );

            }
        );


        // ----------------------------------------------------
        // REPEAT EVERY 3 SECONDS
        // ----------------------------------------------------

        const interval =
            setInterval(() => {

                const latestCameras =
                    camerasRef.current;


                latestCameras.forEach(
                    (camera) => {

                        runDetection(
                            camera
                        );

                    }
                );

            }, 3000);


        // ----------------------------------------------------
        // CLEANUP
        // ----------------------------------------------------

        return () => {

            initialTimers.forEach(
                (timer) => {

                    clearTimeout(
                        timer
                    );

                }
            );


            clearInterval(
                interval
            );

        };

        /*
        IMPORTANT:

        Only restart this detection process when
        YOLO changes between ONLINE/OFFLINE.

        cameras are kept in camerasRef.
        */

    }, [
        yoloStatus
    ]);


    // ========================================================
    // RENDER YOLO STATUS
    // ========================================================

    const renderYOLOStatus = () => {

        if (
            yoloStatus ===
            "CHECKING"
        ) {

            return (

                <div
                    className={
                        styles.yoloChecking
                    }
                >

                    ● CHECKING YOLO BACKEND

                </div>

            );

        }


        if (
            yoloStatus ===
            "ONLINE"
        ) {

            return (

                <div
                    className={
                        styles.yoloOnline
                    }
                >

                    ● YOLO ONLINE

                </div>

            );

        }


        return (

            <div
                className={
                    styles.yoloOffline
                }
                onClick={
                    checkBackend
                }
                title="Click to retry"
            >

                ● YOLO OFFLINE

            </div>

        );

    };


    // ========================================================
    // RENDER DETECTIONS
    // ========================================================

    const renderDetections = (
        cameraId
    ) => {

        const result =
            detectionResults[
                cameraId
            ];


        // ----------------------------------------------------
        // WAITING
        // ----------------------------------------------------

        if (!result) {

            return (

                <div
                    className={
                        styles.detectionWaiting
                    }
                >

                    ● AI ANALYZING...

                </div>

            );

        }


        // ----------------------------------------------------
        // NO OBJECT
        // ----------------------------------------------------

        if (

            !result.detections ||

            result.detections.length === 0

        ) {

            return (

                <div
                    className={
                        styles.noDetection
                    }
                >

                    ✓ NO OBJECT DETECTED

                </div>

            );

        }


        // ----------------------------------------------------
        // OBJECT DETECTIONS
        // ----------------------------------------------------

        return (

            <div
                className={
                    styles.detectionList
                }
            >

                {result.detections.map(
                    (
                        detection,
                        index
                    ) => {

                        const name =

                            detection.className ||

                            detection.class_name ||

                            detection.class ||

                            "Unknown";


                        let confidence =

                            detection.confidencePercent;


                        if (

                            confidence ===
                            undefined ||

                            confidence ===
                            null

                        ) {

                            confidence =
                                Number(
                                    detection.confidence ||
                                    0
                                ) * 100;

                        }


                        /*
                        If backend returned percentage
                        directly, don't multiply again.
                        */

                        if (
                            Number(
                                confidence
                            ) <= 1
                        ) {

                            confidence =
                                Number(
                                    confidence
                                ) * 100;

                        }


                        confidence =
                            Number(
                                confidence
                            ).toFixed(1);


                        return (

                            <div
                                key={
                                    `${cameraId}-${index}-${name}`
                                }
                                className={
                                    styles.detectionTag
                                }
                            >

                                ●{" "}

                                {
                                    name.toUpperCase()
                                }

                                {" "}

                                {
                                    confidence
                                }%

                            </div>

                        );

                    }

                )}

            </div>

        );

    };


    // ========================================================
    // RENDER THREAT
    // ========================================================

    const renderThreat = (
        cameraId
    ) => {

        const result =
            detectionResults[
                cameraId
            ];


        if (

            !result ||

            !result.threat

        ) {

            return null;

        }


        const threat =
            result.threat;


        const level =
            threat.threatLevel ||
            "LOW";


        if (

            level === "LOW" &&

            !threat.alertRequired

        ) {

            return (

                <div
                    className={
                        styles.threatLow
                    }
                >

                    ● THREAT: LOW

                </div>

            );

        }


        return (

            <div
                className={

                    level === "HIGH" ||
                    level === "CRITICAL"

                        ? styles.threatHigh

                        : styles.threatMedium

                }
            >

                ⚠ THREAT:{" "}

                {level}


                {threat.threatScore !==
                    undefined &&

                    ` • SCORE ${threat.threatScore}`

                }

            </div>

        );

    };


    // ========================================================
    // RENDER ALERT
    // ========================================================

    const renderAlert = (
        cameraId
    ) => {

        const result =
            detectionResults[
                cameraId
            ];


        if (

            !result ||

            !result.alertCreated ||

            !result.alert

        ) {

            return null;

        }


        const alert =
            result.alert;


        return (

            <div
                className={
                    styles.alertBox
                }
            >

                <span>

                    ⚠

                </span>


                <div>

                    <strong>

                        {alert.title}

                    </strong>


                    <small>

                        {alert.message}

                    </small>

                </div>

            </div>

        );

    };


    // ========================================================
    // RETURN UI
    // ========================================================

    return (

        <div
            className={
                styles.surveillance
            }
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                className={
                    styles.top
                }
            >

                <div
                    className={
                        styles.title
                    }
                >

                    <h2>

                        LIVE SURVEILLANCE

                    </h2>


                    <p>

                        Real-time monitoring of border surveillance cameras

                    </p>

                </div>


                <div
                    className={
                        styles.status
                    }
                >

                    ●{" "}

                    {activeCameras.length}

                    {" "}

                    CAMERAS ONLINE

                </div>

            </div>


            {/* ==================================================
                YOLO STATUS
            ================================================== */}

            <div
                className={
                    styles.yoloStatusRow
                }
            >

                {renderYOLOStatus()}


                {yoloStatus ===
                    "ONLINE" &&

                    yoloDetails && (

                        <span
                            className={
                                styles.yoloEngineInfo
                            }
                        >

                            Backend: ONLINE

                            {" • "}

                            YOLO: LOADED

                            {" • "}

                            Threat Engine:{" "}

                            {
                                yoloDetails.threatEngine
                            }

                            {" • "}

                            Detection interval: 3 sec

                        </span>

                    )}

            </div>


            {/* ==================================================
                CAMERA GRID
            ================================================== */}

            <div
                className={
                    styles.cameraGrid
                }
            >

                {cameras.map(
                    (camera) => {

                        const result =
                            detectionResults[
                                camera.id
                            ];


                        return (

                            <div
                                className={
                                    styles.cameraCard
                                }
                                key={
                                    camera.id
                                }
                                onClick={() =>
                                    setEnlargedCamera(
                                        camera
                                    )
                                }
                            >

                                {/* VIDEO */}

                                <div
                                    className={
                                        styles.video
                                    }
                                >

                                    <video
                                        ref={
                                            (element) => {

                                                videoRefs.current[
                                                    camera.id
                                                ] =
                                                    element;

                                            }
                                        }
                                        src={
                                            getVideo(
                                                camera.id
                                            )
                                        }
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />


                                    <span
                                        className={
                                            styles.live
                                        }
                                    >

                                        ● LIVE

                                    </span>


                                    <span
                                        className={
                                            styles.timestamp
                                        }
                                    >

                                        {
                                            camera.lastUpdate
                                        }

                                    </span>


                                    {/* AI STATUS */}

                                    <span
                                        className={
                                            styles.aiStatus
                                        }
                                    >

                                        {result

                                            ? "● AI ONLINE"

                                            : "● AI ANALYZING"

                                        }

                                    </span>


                                    <span
                                        className={
                                            styles.expandHint
                                        }
                                    >

                                        ⤢ CLICK TO ENLARGE

                                    </span>

                                </div>


                                {/* CAMERA INFORMATION */}

                                <div
                                    className={
                                        styles.cameraInfo
                                    }
                                >

                                    <div
                                        className={
                                            styles.cameraTop
                                        }
                                    >

                                        <h3>

                                            📹{" "}

                                            {
                                                camera.name
                                                    .toUpperCase()
                                            }

                                        </h3>


                                        <span
                                            className={
                                                statusClass(
                                                    camera.status
                                                )
                                            }
                                        >

                                            ●{" "}

                                            {
                                                camera.status
                                            }

                                        </span>

                                    </div>


                                    <p
                                        className={
                                            styles.location
                                        }
                                    >

                                        📍{" "}

                                        {
                                            camera.location
                                        }

                                    </p>


                                    {/* DETECTION */}

                                    {renderDetections(
                                        camera.id
                                    )}


                                    {/* THREAT */}

                                    {renderThreat(
                                        camera.id
                                    )}


                                    {/* ALERT */}

                                    {renderAlert(
                                        camera.id
                                    )}


                                    {/* LAST AI SCAN */}

                                    {result &&

                                        result.lastDetection && (

                                            <div
                                                className={
                                                    styles.lastDetection
                                                }
                                            >

                                                Last AI scan:{" "}

                                                {
                                                    result.lastDetection
                                                }

                                            </div>

                                        )}

                                </div>

                            </div>

                        );

                    }

                )}

            </div>


            {/* ==================================================
                ENLARGED CAMERA
            ================================================== */}

            {enlargedCamera && (

                <div
                    className={
                        styles.enlargeOverlay
                    }
                    onClick={() =>
                        setEnlargedCamera(
                            null
                        )
                    }
                >

                    <div
                        className={
                            styles.enlargeModal
                        }
                        onClick={
                            (event) =>
                                event.stopPropagation()
                        }
                    >

                        <button
                            className={
                                styles.closeButton
                            }
                            onClick={() =>
                                setEnlargedCamera(
                                    null
                                )
                            }
                        >

                            ✕

                        </button>


                        <div
                            className={
                                styles.enlargeVideo
                            }
                        >

                            <video
                                src={
                                    getVideo(
                                        enlargedCamera.id
                                    )
                                }
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                            />


                            <span
                                className={
                                    styles.live
                                }
                            >

                                ● LIVE

                            </span>


                            <span
                                className={
                                    styles.aiStatus
                                }
                            >

                                ● AI ONLINE

                            </span>

                        </div>


                        <div
                            className={
                                styles.enlargeInfo
                            }
                        >

                            <div
                                className={
                                    styles.enlargeTop
                                }
                            >

                                <h3>

                                    📹{" "}

                                    {
                                        enlargedCamera.name
                                            .toUpperCase()
                                    }

                                </h3>


                                <span
                                    className={
                                        statusClass(
                                            enlargedCamera.status
                                        )
                                    }
                                >

                                    ●{" "}

                                    {
                                        enlargedCamera.status
                                    }

                                </span>

                            </div>


                            <p>

                                📍{" "}

                                {
                                    enlargedCamera.location
                                }

                            </p>


                            {/* ENLARGED DETECTIONS */}

                            <div
                                className={
                                    styles.enlargedDetectionList
                                }
                            >

                                <strong>

                                    AI DETECTION

                                </strong>


                                {renderDetections(
                                    enlargedCamera.id
                                )}


                                {renderThreat(
                                    enlargedCamera.id
                                )}


                                {renderAlert(
                                    enlargedCamera.id
                                )}

                            </div>


                            <p
                                className={
                                    styles.enlargeMeta
                                }
                            >

                                AI scans every 3 seconds

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default LiveSurveillance;