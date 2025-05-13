import jwt from "jsonwebtoken";

// Generate a JSON Web Token for user authentication with a 3-day expiry.
// The token is set as an HTTP-only cookie to enhance security.
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "3d",
  });

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // Set expiry to 3 days.
    httpOnly: true, // Disable JavaScript access to the cookie.
    sameSite: "strict", // Reduce CSRF risk.
    secure: process.env.NODE_ENV !== "development", // Use secure flag in production.
  });

  return token;
};
