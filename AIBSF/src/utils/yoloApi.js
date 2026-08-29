// ============================================================
// YOLO API
// ============================================================

const YOLO_API_URL =
    "http://127.0.0.1:8000";


// ============================================================
// CHECK YOLO HEALTH
// ============================================================

export async function checkYOLOHealth() {

    try {

        const response =
            await fetch(
                `${YOLO_API_URL}/health`
            );


        if (!response.ok) {

            throw new Error(
                `Health check failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return data;

    } catch (error) {

        console.error(
            "YOLO health error:",
            error
        );


        return {

            success: false,

            backend: "OFFLINE",

            yolo: "OFFLINE",

            threatEngine: "OFFLINE",

            error:
                error.message

        };

    }

}


// ============================================================
// SEND FRAME TO YOLO
// ============================================================

export async function detectFrame({

    image,

    confidence = 0.35,

    cameraId = null,

    cameraName = "Unknown Camera",

    location = "Unknown Location"

}) {

    try {

        /*
        ========================================================
        IMPORTANT BASE64 FIX
        ========================================================

        canvas.toDataURL() returns:

        data:image/jpeg;base64,/9j/4AAQ...

        Some FastAPI backends expect:

        /9j/4AAQ...

        Therefore remove the data URL prefix.
        */

        let cleanImage =
            image;


        if (
            typeof cleanImage ===
            "string"
        ) {

            if (
                cleanImage.includes(
                    ","
                )
            ) {

                cleanImage =
                    cleanImage.split(
                        ","
                    )[1];

            }

        }


        if (
            !cleanImage
        ) {

            throw new Error(
                "Invalid or empty image"
            );

        }


        const response =
            await fetch(

                `${YOLO_API_URL}/detect/frame`,

                {

                    method:
                        "POST",

                    headers: {

                        "accept":
                            "application/json",

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            image:
                                cleanImage,

                            confidence,

                            cameraId,

                            cameraName,

                            location

                        })

                }

            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(

                errorText ||

                `Detection failed: ${response.status}`

            );

        }


        const data =
            await response.json();


        return data;

    } catch (error) {

        console.error(
            "YOLO frame detection error:",
            error
        );


        return {

            success:
                false,

            error:
                error.message,

            detectionCount:
                0,

            detections:
                [],

            classes:
                {},

            threat: {

                threatLevel:
                    "LOW",

                alertRequired:
                    false,

                threatCount:
                    0,

                threats:
                    []

            },

            alertCreated:
                false,

            alert:
                null

        };

    }

}