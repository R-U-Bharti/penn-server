const jwt = require("jsonwebtoken");

const graphqlMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if (!authHeader) {
  //   return res.status(401).json({ message: "Authorization header missing" });
  // }

  // const token = authHeader.split(" ")[1];
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViNjQ3MWI1LTU3MDctNDEwZi1iYzExLWFjOGQxNDVmNWVkNSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc2MzAwNTU3MCwiZXhwIjoxNzYzMDkxOTcwfQ.yWrA-Do5lwLWRxAHAFawDvz5-qawCWP0oiIx34N4gZ0";

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = graphqlMiddleware;
