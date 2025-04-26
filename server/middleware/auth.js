import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Get the token from the header
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default auth;
