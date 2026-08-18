import React, { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "UP") {
          setBackendStatus("UP");
        } else {
          setBackendStatus("DOWN");
        }
      })
      .catch(() => {
        setBackendStatus("DOWN");
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          minWidth: "350px",
        }}
      >
        <h1>ShopSphere CI/CD</h1>

        <p>Cloud-Native E-Commerce Platform</p>

        <hr />

        <h2>
          Frontend: <span style={{ color: "green" }}>ONLINE</span>
        </h2>

        <h2>
          Backend:{" "}
          <span
            style={{
              color: backendStatus === "UP" ? "green" : "red",
            }}
          >
            {backendStatus}
          </span>
        </h2>

        <p style={{ marginTop: "30px", color: "#666" }}>
          🚀 Deployed automatically using GitHub Actions
        </p>
      </div>
    </div>
  );
}

export default App;
