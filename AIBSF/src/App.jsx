import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LiveSurveillance from "./components/LiveSurveillance";
import ThreatDetection from "./components/ThreatDetection";
import ActiveAlerts from "./components/ActiveAlerts";
import BorderMap from "./components/BorderMap";
import AIAnalytics from "./components/AIAnalytics";
import Cameras from "./components/Cameras";
import { SurveillanceProvider } from "./context/SurveillanceContext";
import Settings from "./components/Settings";
import styles from "./App.module.css";
import { useState } from "react";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <>
    <SurveillanceProvider>
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
    </SurveillanceProvider>
    </>
  );
}

export default App;
