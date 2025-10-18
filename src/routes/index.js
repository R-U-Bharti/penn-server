const express = require("express");
const authRoutes = require("./auth.routes.js");
const categoryRoutes = require('./categories.route.js')

const router = express.Router();

// Mount all route groups here
router.use("/auth", authRoutes);

// Mount all categories routes
router.use('/category', categoryRoutes)

// Example test route
router.get("/", (req, res) => {
  res.json({ message: "API is up and running ✅" });
});

module.exports = router;
