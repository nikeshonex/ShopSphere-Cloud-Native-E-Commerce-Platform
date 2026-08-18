const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce Backend is running",
    status: "success"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "UP" });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});



