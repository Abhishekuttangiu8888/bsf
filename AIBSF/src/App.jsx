import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LiveSurveillance from "./components/LiveSurveillance";
import ThreatDetection from "./components/ThreatDetection";
import ActiveAlerts from "./components/ActiveAlerts";
import BorderMap from "./components/BorderMap";
import AIAnalytics from "./components/AIAnalytics";
import Cameras from "./components/Cameras";
import Settings from "./components/Settings";
import { SurveillanceProvider, useSurveillance } from "./context/SurveillanceContext";
import styles from "./App.module.css";

function AppShell() {

    const { activePage, setActivePage } = useSurveillance();

    return (
        <>
            <Header />

            <div className={styles.layout}>
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />

                <main className={styles.content}>
                    {activePage === "dashboard" && <Dashboard />}
                    {activePage === "surveillance" && <LiveSurveillance />}
                    {activePage === "threat" && <ThreatDetection />}
                    {activePage === "alerts" && <ActiveAlerts />}
                    {activePage === "map" && <BorderMap />}
                    {activePage === "analytics" && <AIAnalytics />}
                    {activePage === "cameras" && <Cameras />}
                    {activePage === "settings" && <Settings />}
                </main>
            </div>
        </>
    );
}

function App() {
    return (
        <SurveillanceProvider>
            <AppShell />
        </SurveillanceProvider>
    );
}

export default App;