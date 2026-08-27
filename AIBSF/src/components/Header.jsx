import styles from "./Header.module.css";
function Header(){

    return <div className={styles.header}>
        <div className={styles.logo}>
            <h1>🛡️</h1>
            <div className={styles.brand}>
                <h1>BORDERGUARD AI</h1>
                <h5>INTELLIGENT BORDER SURVEILLANCE COMMAND SYSTEM</h5>
            </div>
        </div>
        <div className={styles.status}>
            <h2>● SYSTEM ONLINE</h2>
            <p>All surveillance systems operational</p>
        </div>
        <div className={styles.alert }>
            <h2>🔔 ACTIVE ALERTS</h2>
        </div>
        <div className={styles.user}>
            <h5>👤 COMMAND CENTER</h5>
        </div>




    </div>

}

export default Header;