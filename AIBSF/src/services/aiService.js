const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// CHECK AI BACKEND
// ============================================================

export async function checkAIHealth() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/health`
        );

        if (!response.ok) {
            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        const data = await response.json();

        return {
            connected: data.backend === "ONLINE",
            yoloLoaded: data.yolo === "LOADED",
            data
        };

    } catch (error) {

        console.error(
            "AI backend connection failed:",
            error
        );

        return {
            connected: false,
            yoloLoaded: false,
            data: null
        };
    }
}


// ============================================================
// DETECT FRAME
// ============================================================

export async function detectFrame(
    base64Image,
    confidence = 0.35
) {
    try {

        const response = await fetch(
            `${API_BASE_URL}/detect/frame`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    image: base64Image,
                    confidence
                })
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `Detection failed (${response.status}): ${errorText}`
            );
        }


        return await response.json();

    } catch (error) {

        console.error(
            "Frame detection failed:",
            error
        );

        throw error;
    }
}


// ============================================================
// DETECT IMAGE
// ============================================================

export async function detectImage(
    file,
    confidence = 0.35
) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    const response = await fetch(
        `${API_BASE_URL}/detect?confidence=${confidence}`,
        {
            method: "POST",
            body: formData
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Image detection failed (${response.status}): ${errorText}`
        );
    }


    return await response.json();
}