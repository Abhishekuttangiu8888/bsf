import styles from "./AIAnalytics.module.css";

function AIAnalytics() {

    return (
        <div className={styles.analytics}>

            {/* TOP */}

            <div className={styles.top}>

                <div>
                    <h2>AI ANALYTICS</h2>

                    <p>
                        Intelligent analysis of surveillance and threat detection data
                    </p>
                </div>

                <div className={styles.status}>
                    ● AI ENGINE ONLINE
                </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className={styles.summaryGrid}>

                <div className={styles.card}>
                    <span>DETECTION ACCURACY</span>
                    <strong>96.8%</strong>
                    <p>AI model performance</p>
                </div>

                <div className={styles.card}>
                    <span>PEOPLE DETECTED</span>
                    <strong>184</strong>
                    <p>Last 24 hours</p>
                </div>

                <div className={styles.card}>
                    <span>VEHICLES DETECTED</span>
                    <strong>76</strong>
                    <p>Last 24 hours</p>
                </div>

                <div className={styles.card}>
                    <span>SUSPICIOUS EVENTS</span>
                    <strong className={styles.red}>12</strong>
                    <p>AI flagged events</p>
                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className={styles.mainGrid}>

                {/* DETECTION ANALYSIS */}

                <div className={styles.analysisCard}>

                    <div className={styles.cardHeader}>

                        <div>
                            <h3>DETECTION ANALYSIS</h3>
                            <p>AI classification overview</p>
                        </div>

                        <span>24 HOURS</span>

                    </div>


                    <div className={styles.bars}>

                        <div className={styles.barItem}>

                            <div className={styles.barLabel}>
                                <span>PERSON</span>
                                <strong>184</strong>
                            </div>

                            <div className={styles.barBackground}>
                                <div
                                    className={styles.personBar}
                                    style={{ width: "85%" }}
                                ></div>
                            </div>

                        </div>


                        <div className={styles.barItem}>

                            <div className={styles.barLabel}>
                                <span>VEHICLE</span>
                                <strong>76</strong>
                            </div>

                            <div className={styles.barBackground}>
                                <div
                                    className={styles.vehicleBar}
                                    style={{ width: "55%" }}
                                ></div>
                            </div>

                        </div>


                        <div className={styles.barItem}>

                            <div className={styles.barLabel}>
                                <span>ANIMAL</span>
                                <strong>42</strong>
                            </div>

                            <div className={styles.barBackground}>
                                <div
                                    className={styles.animalBar}
                                    style={{ width: "35%" }}
                                ></div>
                            </div>

                        </div>


                        <div className={styles.barItem}>

                            <div className={styles.barLabel}>
                                <span>UNKNOWN</span>
                                <strong>18</strong>
                            </div>

                            <div className={styles.barBackground}>
                                <div
                                    className={styles.unknownBar}
                                    style={{ width: "20%" }}
                                ></div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* AI MODEL STATUS */}

                <div className={styles.modelCard}>

                    <h3>AI MODEL STATUS</h3>

                    <p className={styles.modelDescription}>
                        Current detection models
                    </p>


                    <div className={styles.model}>

                        <div>
                            <strong>PERSON DETECTION</strong>
                            <span>YOLO Vision Model</span>
                        </div>

                        <b>ONLINE</b>

                    </div>


                    <div className={styles.model}>

                        <div>
                            <strong>VEHICLE DETECTION</strong>
                            <span>Object Recognition Model</span>
                        </div>

                        <b>ONLINE</b>

                    </div>


                    <div className={styles.model}>

                        <div>
                            <strong>THREAT CLASSIFICATION</strong>
                            <span>Behavior Analysis Model</span>
                        </div>

                        <b>ONLINE</b>

                    </div>


                    <div className={styles.model}>

                        <div>
                            <strong>FACE ANALYSIS</strong>
                            <span>Identity Analysis Model</span>
                        </div>

                        <b>ONLINE</b>

                    </div>

                </div>

            </div>


            {/* RECENT AI EVENTS */}

            <div className={styles.eventsCard}>

                <div className={styles.cardHeader}>

                    <div>
                        <h3>RECENT AI EVENTS</h3>

                        <p>
                            Latest detections generated by AI
                        </p>
                    </div>

                    <span>LIVE</span>

                </div>


                <div className={styles.events}>

                    <div className={styles.event}>

                        <div className={styles.eventIcon}>
                            ⚠
                        </div>

                        <div className={styles.eventInfo}>
                            <strong>Suspicious Movement Detected</strong>
                            <p>
                                North Border Sector • Camera 01
                            </p>
                        </div>

                        <div className={styles.eventTime}>
                            2 min ago
                        </div>

                    </div>


                    <div className={styles.event}>

                        <div className={styles.eventIcon}>
                            🚗
                        </div>

                        <div className={styles.eventInfo}>
                            <strong>Vehicle Detected</strong>
                            <p>
                                East Border Sector • Camera 03
                            </p>
                        </div>

                        <div className={styles.eventTime}>
                            8 min ago
                        </div>

                    </div>


                    <div className={styles.event}>

                        <div className={styles.eventIcon}>
                            👤
                        </div>

                        <div className={styles.eventInfo}>
                            <strong>Person Detected</strong>
                            <p>
                                South Border Sector • Camera 02
                            </p>
                        </div>

                        <div className={styles.eventTime}>
                            12 min ago
                        </div>

                    </div>


                    <div className={styles.event}>

                        <div className={styles.eventIcon}>
                            ⚠
                        </div>

                        <div className={styles.eventInfo}>
                            <strong>Restricted Zone Entry</strong>
                            <p>
                                West Border Sector • Camera 04
                            </p>
                        </div>

                        <div className={styles.eventTime}>
                            18 min ago
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AIAnalytics;