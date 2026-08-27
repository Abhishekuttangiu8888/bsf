import { useState } from "react";
import styles from "./Settings.module.css";

function Settings() {

    const [notifications, setNotifications] = useState({
        desktopAlerts: true,
        soundAlerts: true,
        emailAlerts: false,
        autoRefresh: true
    });

    const [aiConfidence, setAiConfidence] = useState(80);
    const [refreshRate, setRefreshRate] = useState("5");
    const [resolution, setResolution] = useState("1080p");
    const [sessionTimeout, setSessionTimeout] = useState("30");
    const [twoFactor, setTwoFactor] = useState(true);

    const [saved, setSaved] = useState(true);


    const toggleNotification = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key]
        });
        setSaved(false);
    };


    const handleSave = () => {
        setSaved(true);
    };


    return (
        <div className={styles.settings}>

            {/* ================= TOP ================= */}

            <div className={styles.top}>

                <div>
                    <h2>SETTINGS</h2>

                    <p>
                        Configure system preferences and detection parameters
                    </p>
                </div>

                <div className={saved ? styles.savedStatus : styles.unsavedStatus}>
                    {saved ? "● ALL CHANGES SAVED" : "● UNSAVED CHANGES"}
                </div>

            </div>


            {/* ================= NOTIFICATIONS ================= */}

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h3>🔔 NOTIFICATIONS</h3>
                    <p>Manage how you receive alerts</p>
                </div>

                <div className={styles.rows}>

                    <div className={styles.row}>
                        <div>
                            <strong>Desktop Alerts</strong>
                            <span>Show pop-up notifications for new threats</span>
                        </div>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={notifications.desktopAlerts}
                                onChange={() => toggleNotification("desktopAlerts")}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>


                    <div className={styles.row}>
                        <div>
                            <strong>Sound Alerts</strong>
                            <span>Play a sound when a critical alert fires</span>
                        </div>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={notifications.soundAlerts}
                                onChange={() => toggleNotification("soundAlerts")}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>


                    <div className={styles.row}>
                        <div>
                            <strong>Email Alerts</strong>
                            <span>Send a daily summary to your inbox</span>
                        </div>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={notifications.emailAlerts}
                                onChange={() => toggleNotification("emailAlerts")}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>


                    <div className={styles.row}>
                        <div>
                            <strong>Auto Refresh</strong>
                            <span>Automatically refresh camera feeds and alerts</span>
                        </div>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={notifications.autoRefresh}
                                onChange={() => toggleNotification("autoRefresh")}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                </div>

            </div>


            {/* ================= AI DETECTION ================= */}

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h3>🤖 AI DETECTION</h3>
                    <p>Tune detection sensitivity</p>
                </div>

                <div className={styles.rows}>

                    <div className={styles.sliderRow}>

                        <div className={styles.sliderLabel}>
                            <strong>Confidence Threshold</strong>
                            <span>{aiConfidence}%</span>
                        </div>

                        <input
                            type="range"
                            min="50"
                            max="99"
                            value={aiConfidence}
                            onChange={(event) => {
                                setAiConfidence(event.target.value);
                                setSaved(false);
                            }}
                            className={styles.range}
                        />

                        <p className={styles.hint}>
                            Alerts below this confidence level will be ignored
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= CAMERA SETTINGS ================= */}

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h3>📹 CAMERA SETTINGS</h3>
                    <p>Default feed configuration</p>
                </div>

                <div className={styles.rows}>

                    <div className={styles.row}>
                        <div>
                            <strong>Default Resolution</strong>
                            <span>Applies to all newly connected cameras</span>
                        </div>

                        <select
                            value={resolution}
                            onChange={(event) => {
                                setResolution(event.target.value);
                                setSaved(false);
                            }}
                            className={styles.select}
                        >
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                            <option value="4K">4K</option>
                        </select>
                    </div>


                    <div className={styles.row}>
                        <div>
                            <strong>Refresh Rate</strong>
                            <span>How often live feeds poll for updates</span>
                        </div>

                        <select
                            value={refreshRate}
                            onChange={(event) => {
                                setRefreshRate(event.target.value);
                                setSaved(false);
                            }}
                            className={styles.select}
                        >
                            <option value="1">Every 1 second</option>
                            <option value="5">Every 5 seconds</option>
                            <option value="10">Every 10 seconds</option>
                        </select>
                    </div>

                </div>

            </div>


            {/* ================= SECURITY ================= */}

            <div className={styles.card}>

                <div className={styles.cardHeader}>
                    <h3>🔒 SECURITY</h3>
                    <p>Access and session controls</p>
                </div>

                <div className={styles.rows}>

                    <div className={styles.row}>
                        <div>
                            <strong>Two-Factor Authentication</strong>
                            <span>Require a code at login</span>
                        </div>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={twoFactor}
                                onChange={() => {
                                    setTwoFactor(!twoFactor);
                                    setSaved(false);
                                }}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>


                    <div className={styles.row}>
                        <div>
                            <strong>Session Timeout</strong>
                            <span>Auto-lock the command center after inactivity</span>
                        </div>

                        <select
                            value={sessionTimeout}
                            onChange={(event) => {
                                setSessionTimeout(event.target.value);
                                setSaved(false);
                            }}
                            className={styles.select}
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="never">Never</option>
                        </select>
                    </div>

                </div>

            </div>


            {/* ================= SAVE BAR ================= */}

            <div className={styles.saveBar}>

                <span>
                    {saved
                        ? "All settings are up to date."
                        : "You have unsaved changes."}
                </span>

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saved}
                >
                    SAVE CHANGES
                </button>

            </div>

        </div>
    );
}

export default Settings;