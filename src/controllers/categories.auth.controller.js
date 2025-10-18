const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const createCategories = asyncHandler(async (req, res) => {
  const { category_name } = req.body;

  // 1️⃣ Input validation
  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ message: "Category name is required." });
  }

  // 2️⃣ Check if already exists (case-insensitive)
  const existing = await pool.query(
    `SELECT id FROM categories WHERE LOWER(name) = LOWER($1)`,
    [category_name.trim()]
  );

  if (existing.rowCount > 0) {
    return res.status(400).json({ message: "Category already exists." });
  }

  // 3️⃣ Insert new category safely
  const insertQuery = `
    INSERT INTO categories (name, created_at)
    VALUES ($1, NOW())
    RETURNING id, name, created_at;
  `;

  const result = await pool.query(insertQuery, [category_name.trim()]);

  // 4️⃣ Success response
  return res.status(201).json({
    message: "Category created successfully.",
    category: result.rows[0],
  });
});

module.exports = { createCategories };
