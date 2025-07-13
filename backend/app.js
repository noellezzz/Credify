import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import certificatesRoutes from "./routes/certificates.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import schoolRoutes from "./routes/school.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" })); // large payload for base64
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/schools", schoolRoutes);

export default app;
