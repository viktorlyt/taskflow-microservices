import { query } from "./database.ts";

export const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

     -- Index for fast email lookups (login queries)
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    
    -- Index for role-based queries  
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `;

  try {
    await query(createTableQuery);
    console.log("✅ Users table created successfully");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
    throw error;
  }
};

// (async () => {
//   try {
//     await createUsersTable();
//     const res = await query("SELECT NOW()");
//     console.log("📅 DB time:", res.rows[0].now);

//     const dbNameRes = await query("SELECT current_database()");
//     console.log("Current DB:", dbNameRes.rows[0].current_database);
//     // process.exit(0);
//   } catch (err) {
//     console.error("❌ Failed to connect or query the database", err);
//     process.exit(1);
//   }
// })();
