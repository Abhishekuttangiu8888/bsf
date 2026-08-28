import styles from "./Sidebar.module.css";

function Sidebar({ activePage, setActivePage }) {

    const navigation = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "▦"
        },
        {
            id: "surveillance",
            label: "Live Surveillance",
            icon: "◉"
        },
        {
            id: "threat",
            label: "Threat Detection",
            icon: "⚠"
        },
        {
            id: "alerts",
            label: "Active Alerts",
            icon: "🔔"
        },
        {
            id: "incidents",
            label: "Incidents",
            icon: "🚨"
        },
        {
            id: "map",
            label: "Border Map",
            icon: "⌖"
        },
        {
            id: "analytics",
            label: "AI Analytics",
            icon: "▥"
        },
        {
            id: "cameras",
            label: "Camera Management",
            icon: "📹"
        }
    ];

    return (
        <aside className={styles.sidebar}>

            <div className={styles.section}>

                <h3 className={styles.sectionTitle}>
                    Main Navigation
                </h3>

                <nav className={styles.nav}>

                    {navigation.map((item) => (

                        <button
                            key={item.id}
                            className={`${styles.navItem} ${
                                activePage === item.id
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() =>
                                setActivePage(item.id)
                            }
                        >

                            <span className={styles.icon}>
                                {item.icon}
                            </span>

                            <span className={styles.label}>
                                {item.label}
                            </span>

                        </button>

                    ))}

                </nav>

            </div>


            <div className={styles.systemSection}>

                <h3 className={styles.sectionTitle}>
                    System
                </h3>

                <nav className={styles.nav}>

                    <button
                        className={`${styles.navItem} ${
                            activePage === "settings"
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("settings")
                        }
                    >

                        <span className={styles.icon}>
                            ⚙
                        </span>

                        <span className={styles.label}>
                            Settings
                        </span>

                    </button>

                </nav>

            </div>

        </aside>
    );
}

export default Sidebar;