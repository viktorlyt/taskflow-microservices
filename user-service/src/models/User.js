import bcrypt from "bcryptjs";
import { query } from "../config/database.ts";

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.role = userData.role;
    this.isActive = userData.is_active;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  static async create({ email, password, firstName, lastName, role = "user" }) {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const result = await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, email, first_name, last_name, role, is_active, created_at`,
        [email, passwordHash, firstName, lastName, role]
      );

      return new User(result.rows[0]);
    } catch (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const result = await query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );

    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  // Instance method to verify password
  async verifyPassword(password) {
    const result = await query(
      "SELECT password_hash FROM users WHERE id = $1",
      [this.id]
    );

    if (result.rows.length === 0) {
      return false;
    }

    return bcrypt.compare(password, result.rows[0].password_hash);
  }

  // Instance method to get public data (no sensitive info)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}

export default User;
