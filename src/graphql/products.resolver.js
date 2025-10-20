const pool = require("../config/pool.js");

const productsResolvers = {
  Query: {
    products: async () => {
      const { rows } = await pool.query(
        "SELECT * FROM products ORDER BY created_at DESC"
      );
      return rows;
    },
    product: async (_, { id }) => {
      const { rows } = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );
      return rows[0];
    },
  },
};

module.exports = productsResolvers;
