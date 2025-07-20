import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import certificatesRoutes from "./routes/certificates.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import verificationRequestsRoutes from "./routes/verification-requests.routes.js";
import organizationAuthRoutes from "./routes/organization-auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" })); // large payload for base64
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/auth/organizations", organizationAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/verification-requests", verificationRequestsRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: "Not Found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.stack : "Internal Server Error"
    });
});

export default app;
