import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import { createUsersTable } from "./config/init-db.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database on startup
const initializeDatabase = async () => {
  try {
    await createUsersTable();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" })); // Prevent huge payloads

// Routes
app.use("/api/users", userRoutes);
// app.use("/api/users", (req, res) => res.send("User routes works"));

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Start server
const startServer = async () => {
  await initializeDatabase();

  console.log("Starting server...");
  app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
  console.log("app.listen called");
};

app.get("/health", (req, res) => {
  res.json({ status: "User service is running", timestamp: new Date() });
});

startServer().catch(console.error);
