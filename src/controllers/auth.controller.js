/*
@desc: Register User
@route: /api/auth/register
*/

const bcrypt = require("bcrypt");
const pool = require("../config/pool");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required." });

  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
    email,
  ]);

  if (existing.rowCount > 0)
    return res.status(400).json({ message: "Email already exists." });

  const hashPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, name, email, role
    `;

  const values = [name, email, hashPassword, "customer"];
  const result = await pool.query(insertQuery, values);
  const user = result.rows[0];

  return res.status(201).json({ message: "Registered Successfully.", user });
});

/*
@desc: Login User
@route: /api/auth/login
*/

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and Password required." });

  // Check user
  const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (checkUser.rowCount === 0)
    return res.status(400).json({ message: "User not exist." });

  const user = checkUser.rows[0];
  const checkPassword = bcrypt.compare(password, user.password_hash);
  if (!checkPassword)
    return res.status(401).json({ message: "Password Invalid." });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    expiredIn: "24",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { login, register };
