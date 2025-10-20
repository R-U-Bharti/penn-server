const jwt = require("jsonwebtoken");

// SIGNING
const secret = "penn$erver";
const token = jwt.sign({ id: 1 }, secret, { expiresIn: "1d" });
console.log("Token:", token);

// VERIFYING
const payload = jwt.verify(token, secret);
console.log("Payload:", payload);
