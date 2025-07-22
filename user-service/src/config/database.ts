import { Pool, type PoolClient, type QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Why Pool instead of Client?
// Pool manages multiple connections, handles reconnection automatically
// Client = single connection, you manage lifecycle manually
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Connection pool settings
  max: 10, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout if can't connect in 2s
});

// Test connection on startup
pool.on("connect", () => {
  console.log("📊 Connected to PostgreSQL database");
});

pool.on("error", (err, client) => {
  console.error("❌ Database connection error:", err);
  process.exit(-1); // Exit app if database is unreachable
});

// Helper function for queries
export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

// Helper function to get a client for transactions
export const getClient = (): Promise<PoolClient> => {
  return pool.connect();
};
