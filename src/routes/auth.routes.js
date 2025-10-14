const express = require('express');
const { register, login } = require("../controllers/auth.controller.js");

const router = express.Router();

// Auth endpoints
router.post("/register", register);
router.post("/login", login);

module.exports = router;