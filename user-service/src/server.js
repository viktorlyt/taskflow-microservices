import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "User service is running", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
