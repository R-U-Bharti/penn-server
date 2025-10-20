const pool = require("../config/pool");
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

const deleteCategories = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const deleteQuery = `DELETE FROM categories WHERE id=$1 OR parent_id=$1`;
  pool.query(deleteQuery, [id]).then(() => {
    res.json({ message: "Category deleted." });
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const result = await pool.query(`SELECT * FROM categories`);
  return res.json({
    data: result.rows,
  });
});

const createSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const { sub_categories } = req.body;

  if (!id || !Array.isArray(sub_categories) || sub_categories.length === 0) {
    return res.status(400).json({ message: "Invalid input." });
  }

  // Check parent category exists
  const checkCat = await pool.query(`SELECT id FROM categories WHERE id = $1`, [
    id,
  ]);
  if (checkCat.rowCount === 0) {
    return res.status(400).json({ message: "Parent category not found." });
  }

  // Remove duplicates from input
  const uniqueSubs = [...new Set(sub_categories.filter(item => item && item.length > 0).map(name => name.trim()))];

  // Prepare to track success/failure
  const succeed = [];
  const failed = [];

  const checkSubQuery = `SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND parent_id = $2`;
  const insertQuery = `INSERT INTO categories (name, parent_id) VALUES ($1, $2)`;

  for (const cat of uniqueSubs) {
    try {
      // Check sub categories exist or not
      const exist = await pool.query(checkSubQuery, [cat, id]);
      if (exist.rowCount > 0) {
        failed.push(cat);
        continue;
      }

      // Insert sub category
      await pool.query(insertQuery, [cat, id]);
      succeed.push(cat);
    } catch (err) {
      failed.push(cat);
    }
  }

  return res.json({
    succeed,
    failed,
  });
});

module.exports = {
  createCategories,
  deleteCategories,
  getAllCategories,
  createSubCategory,
};
