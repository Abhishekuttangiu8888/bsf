import styles from "./Dashboard.module.css";
function Dashboard(){
    return <div className={styles.dashboard}>


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
            <div>24</div>
            <div>Surveillance units deployed</div>
        </div>

        <div className={styles.fourth}>
            <div>🟢 ACTIVE CAMERAS</div>
            <div>21</div>
            <div>87.5% operational</div>
        </div>

        <div className={styles.fifth}>
            <div>🚨 ACTIVE THREATS</div>
            <div>3</div>
            <div>Immediate attention required</div>
        </div>

        <div className={styles.sixth}>
            <div>🤖 AI SYSTEM STATUS</div>
            <div>ONLINE</div>
            <div>All detection models operational</div>
        </div>


        
        





    </div>

}
export default Dashboard;