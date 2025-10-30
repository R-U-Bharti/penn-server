const jwt = require("jsonwebtoken");

const graphqlMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (verifyToken) next();

    res.status(400).send({ message: "Bhaag yaha se" });
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2NzY2OWE5LTY0MGUtNDhkNy04ZDFmLTJiZDQzMzMxZjNhZiIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc2MTgyMDI3NiwiZXhwIjoxNzYxOTA2Njc2fQ.U1-HauTLjDet9frwkKhPIUMvKDo6SsSsb38XHDVo8MU";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token not valid." });
  }
};

module.exports = graphqlMiddleware;
