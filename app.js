import express from "express";
import cors from "cors";
import connectDB from "./src/config/db-config.js";
import dotenv from "dotenv";
import morgan from "morgan";
import route from "./src/routes/index.js";
dotenv.config();

const app = express();
app.use(express.json());
// Allow CORS for all origins
app.use(cors()); // Default: Allows all origins (same as cors({ origin: '*' }))
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"] 
}));
// Middleware: Logging HTTP requests
app.use(morgan("dev")); // "dev" format logs method, status, and response time
connectDB()

// Routes
app.use("/api/v1", route);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
