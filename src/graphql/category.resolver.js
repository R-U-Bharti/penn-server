const pool = require("../config/pool");

const categoryResolvers = {
  Query: {
    // Get all categories (with subcategories)
    categories: async () => {
      const { rows } = await pool.query(
        "SELECT * FROM categories ORDER BY name ASC"
      );
      return rows;
    },

    // Get a single category by ID
    category: async (_, { id }) => {
      const { rows } = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
      );
      return rows[0];
    },
  },

  Mutation: {
    // Create category or subcategory
    createCategories: async (_, { name, parent_id }) => {
      const { rows } = await pool.query(
        `INSERT INTO categories (name, parent_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name.trim(), parent_id || null]
      );
      return rows[0];
    },

    // Delete category
    deleteCategories: async (_, { id }) => {
      const result = await pool.query("DELETE FROM categories WHERE id = $1", [
        id,
      ]);
      return result.rowCount > 0;
    },
  },
};

module.exports = categoryResolvers;
