/*
@desc: Register User
@route: /api/auth/register
*/

const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Register /auth/register: ", error)
    return res.status(500).json({ message: "😒 Internal Server Error" });
  }
};

/*
@desc: Login User
@route: /api/auth/login
*/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and Password required." });

    // Check user
    const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!checkUser) return res.status(400).json({ message: "User not exist." });

    const user = checkUser.rows[0];
    const checkPassword = bcrypt.compare(password, user.hashPassword);
    if (!checkPassword)
      return res.status(401).json({ message: "Password Invalid." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60s" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "😒 Internal Server Error" });
  }
};

module.exports = { login, register };
