import styles from "./Dashboard.module.css";
import { useSurveillance } from "../context/SurveillanceContext";

function Dashboard() {
const {
cameras,
activeCameras,
activeThreats
} = useSurveillance();


const activePercentage =
    cameras.length > 0
        ? ((activeCameras.length / cameras.length) * 100).toFixed(1)
        : 0;

return (
    <div className={styles.dashboard}>

        <div className={styles.first}>
            <h1>COMMAND DASHBOARD</h1>
            <h5>Real-time border surveillance and intelligence overview</h5>
        </div>

        <div className={styles.second}>
            <div>● LIVE SYSTEM</div>
            <div>Last updated: Just now</div>
        </div>

        <div className={styles.third}>
            <div>📹 TOTAL CAMERAS</div>
            <div>{cameras.length}</div>
            <div>Surveillance units deployed</div>
        </div>

        <div className={styles.fourth}>
            <div>🟢 ACTIVE CAMERAS</div>
            <div>{activeCameras.length}</div>
            <div>{activePercentage}% operational</div>
        </div>

        <div className={styles.fifth}>
            <div>🚨 ACTIVE THREATS</div>
            <div>{activeThreats.length}</div>
            <div>Immediate attention required</div>
        </div>

        <div className={styles.sixth}>
            <div>🤖 AI SYSTEM STATUS</div>
            <div>ONLINE</div>
            <div>All detection models operational</div>
        </div>

    </div>
);


}

export default Dashboard;
