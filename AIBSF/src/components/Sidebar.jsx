import styles from "./Sidebar.module.css";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.first}>
        <h4>🛰️ OPERATIONS</h4>

        <div>
          <div
            onClick={() => setActivePage("dashboard")}
            className={activePage === "dashboard" ? styles.active : ""}
          >
            ▣ Dashboard
          </div>

          <div
            onClick={() => setActivePage("surveillance")}
            className={activePage === "surveillance" ? styles.active : ""}
          >
            📡 Live Surveillance
          </div>

          <div
            onClick={() => setActivePage("threat")}
            className={activePage === "threat" ? styles.active : ""}
          >
            🎯 Threat Detection
          </div>

          <div
            onClick={() => setActivePage("alerts")}
            className={activePage === "alerts" ? styles.active : ""}
          >
            🚨 Active Alerts
          </div>
        </div>
      </div>

      <div className={styles.second}>
        <h4>🧠 INTELLIGENCE</h4>

        <div>
          <div
            onClick={() => setActivePage("map")}
            className={activePage === "map" ? styles.active : ""}
          >
            🗺️ Border Map
          </div>
          <div
            onClick={() => setActivePage("analytics")}
            className={activePage === "analytics" ? styles.active : ""}
          >
            🤖 AI Analytics
          </div>
        </div>
      </div>

      <div className={styles.third}>
        <h4>⚙️ SYSTEM</h4>

        <div>
          <div
            onClick={() => setActivePage("cameras")}
            className={activePage === "cameras" ? styles.active : ""}
          >
            📹 Cameras
          </div>
          <div
            onClick={() => setActivePage("settings")}
            className={activePage === "settings" ? styles.active : ""}
          >
            ⚙️ Settings
          </div>
        </div>
      </div>

      <div className={styles.fourth}>
        <h4>🔒 SECURE CONNECTION</h4>

        <div>
          <div>● ENCRYPTED</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
