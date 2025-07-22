import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registrationSchema, loginSchema } from "../validation/userSchema.js";

const router = express.Router();

// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    // Step 1: Validate input
    const { error, value } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findByEmail(value.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Step 3: Create new user
    const newUser = await User.create({
      email: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName,
    });

    // Step 4: Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Step 5: Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: newUser.toJSON(),
        token: token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Health check endpoint (keep existing)
router.get("/health", (req, res) => {
  res.json({
    status: "User Service is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
