const {
  getAllCategory,
  createCategory,
  getCategoryById,
  deleteCategory,
  createSubCategory,
} = require("../../controllers/category.controller");

const categoryResolvers = {
  Query: {
    // Get all categories (with subcategories)
    allCategory: getAllCategory,

    // Get a single category by ID
    categoryById: getCategoryById,
  },

  Mutation: {
    // Create category or subcategory
    createCategory: createCategory,

    // Delete category
    deleteCategory: deleteCategory,

    // Create subcategories under a parent category
    createSubCategory: createSubCategory,
  },
};

module.exports = categoryResolvers;
