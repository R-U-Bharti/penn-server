const express = require("express");
const authRoutes = require("./auth.routes.js");

const router = express.Router();

// Mount all route groups here
router.use("/auth", authRoutes);

// Example test route
router.get("/", (req, res) => {
  res.json({ message: "API is up and running ✅" });
});

module.exports = router;
