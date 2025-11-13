const {
  getAllCategory,
  createCategory,
  getCategoryById,
  deleteCategory,
  createSubCategory,
  getSubCategoryList,
} = require("../../controllers/category.controller");

const categoryResolvers = {
  Query: {
    // Get all categories (with subcategories)
    allCategory: getAllCategory,

  },
  
  Mutation: {
    // Get a category by ID
    categoryById: getCategoryById,

    // Get sub categories list by parentId
    subCaegoryList: getSubCategoryList,

    // Create category or subcategory
    createCategory: createCategory,

    // Delete category
    deleteCategory: deleteCategory,

    // Create subcategories under a parent category
    createSubCategory: createSubCategory,
  },
};

module.exports = categoryResolvers;
