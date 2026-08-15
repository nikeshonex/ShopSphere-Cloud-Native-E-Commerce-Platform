import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("DOWN");
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ShopSphere</h1>

        <p>Cloud-Native E-Commerce Platform</p>

        <div className="status">
          <p>
            <strong>Frontend:</strong> ONLINE
          </p>

          <p>
            <strong>Backend:</strong> {backendStatus}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
