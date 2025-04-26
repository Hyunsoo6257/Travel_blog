import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import userRoutes from "./routes/userRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

// Admin account configuration
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "adminpassword";
const ADMIN_USERNAME = "admin";

// Function to create admin account
const createAdminUser = async () => {
  try {
    // Check if admin account already exists
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      const adminUser = new User({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        userTitle: "Administrator",
        isAdmin: true,
        profileImage: "",
        savedArticles: [],
      });

      await adminUser.save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
};

// MongoDB connection and server startup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await createAdminUser();
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error(err));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
