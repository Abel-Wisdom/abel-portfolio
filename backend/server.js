
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./src/routes/projectRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/settings", settingsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Abel Portfolio API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is healthy.",
    timestamp: new Date().toISOString(),
  });
});


app.use("/api/projects", projectRoutes);

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio API running on port ${PORT}`);
});
