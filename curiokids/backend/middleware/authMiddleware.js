import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token; // Extract token from HTTP-only cookie

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Store decoded user info in req.user
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
