import styles from "./LiveSurveillance.module.css";

function LiveSurveillance() {
  return (
    <div className={styles.surveillance}>
      {/* Top section */}
      <div className={styles.top}>
        <div className={styles.title}>
          <h2>LIVE SURVEILLANCE</h2>
          <p>Real-time monitoring of border surveillance cameras</p>
        </div>

        <div className={styles.status}>● 21 CAMERAS ONLINE</div>
      </div>

      {/* Camera section */}
      <div className={styles.cameraGrid}>
        <div className={styles.cameraCard}>
          <div className={styles.video}>
            <span className={styles.live}>● LIVE</span>

            <div className={styles.feedText}>CAMERA FEED</div>

            <span className={styles.timestamp}>12:45:32</span>
          </div>

          <div className={styles.cameraInfo}>
            <div className={styles.cameraTop}>
              <h3>📹 CAMERA 01</h3>

              <span className={styles.active}>● ACTIVE</span>
            </div>

            <p className={styles.location}>📍 North Border Sector</p>
          </div>
        </div>

        <div className={styles.cameraCard}>
          <div className={styles.video}>LIVE FEED</div>

          <div className={styles.cameraInfo}>
            <div className={styles.cameraTop}>
              <h3>📹 CAMERA 02</h3>
              <span className={styles.active}>● ACTIVE</span>
            </div>

            <p className={styles.location}>📍 South Border Sector</p>
          </div>
        </div>

        <div className={styles.cameraCard}>
          <div className={styles.video}>LIVE FEED</div>

          <div className={styles.cameraInfo}>
            <div className={styles.cameraTop}>
              <h3>📹 CAMERA 03</h3>
              <span className={styles.warning}>● WARNING</span>
            </div>

            <p className={styles.location}>📍 East Border Sector</p>
          </div>
        </div>

        <div className={styles.cameraCard}>
          <div className={styles.video}>LIVE FEED</div>

          <div className={styles.cameraInfo}>
            <div className={styles.cameraTop}>
              <h3>📹 CAMERA 04</h3>
              <span className={styles.offline}>● OFFLINE</span>
            </div>

            <p className={styles.location}>📍 West Border Sector</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveSurveillance;
