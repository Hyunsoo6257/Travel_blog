import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {
  registerUser: async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password length validation (changed to 8)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        userTitle: "",
        isAdmin: false,
        profileImage: "",
        savedArticles: [],
      });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create token - isAdmin 정보 추가
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin, // isAdmin 정보를 토큰에 포함
        },
        process.env.JWT_SECRET
      );

      res.json({
        token,
        username: user.username,
        id: user._id,
        profileImage: user.profileImage || "",
        userTitle: user.userTitle || "",
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Get pagination parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Get total count of users
      const total = await User.countDocuments();

      // Get paginated user list
      const users = await User.find()
        .select("-password")
        .skip(skip)
        .limit(limit);

      // Send response with pagination data
      res.json({
        users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSavedArticles: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: "savedArticles",
        populate: [
          { path: "author", select: "name profileImage" },
          { path: "category", select: "name" },
        ],
      });
      res.json(user.savedArticles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const updateData = {};

      // 값이 있을 때만 업데이트 데이터에 추가
      if (req.body.username) updateData.username = req.body.username;
      if (req.body.userTitle) updateData.userTitle = req.body.userTitle;
      if (req.body.profileImage)
        updateData.profileImage = req.body.profileImage;

      // 업데이트할 데이터가 없어도 에러가 나지 않도록 함
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default userController;
