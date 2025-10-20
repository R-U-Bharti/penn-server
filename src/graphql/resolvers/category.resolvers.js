const prisma = require("../../config/prisma");

const categoryResolvers = {
  Query: {
    // Get all categories (with subcategories)
    allCategory: async () => {
      const data = await prisma.categories.findMany();
      return data;
    },

    // Get a single category by ID
    categoryById: async (_, { id }) => {
      const data = prisma.categories.findUnique({ where: { id: id } });
      return data;
    },
  },

  Mutation: {
    // Create category or subcategory
    createCategory: async (_, { name }) => {
      const category = await prisma.category.create({
        data: {
          name: name.trim(),
        },
      });
      return category;
    },

    // Delete category
    deleteCategory: async (_, { id }) => {
      await prisma.categories.deleteMany({
        where: { OR: [{ id: id }, { parent_id: id }] },
      });
      return "Deleted Successfully.";
    },

    createSubCategory: async (_, input) => {
      const { parentId, subCategories } = input;

      if (!parentId || !Array.isArray(subCategories) || subCategories.length === 0) {
        throw new Error("Invalid input.");
      }

      // Check if parent category exists
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new Error("Parent category not found.");
      }

      // Remove duplicates & trim
      const uniqueSubs = [...new Set(subCategories.filter(item => item.length > 0).map(name => name.trim()))];

      const succeed = [];
      const failed = [];

      for (const name of uniqueSubs) {
        try {
          // Check if subcategory already exists under the parent
          const exist = await prisma.category.findFirst({
            where: {
              parentId,
              name: { equals: name, mode: 'insensitive' } // case-insensitive check
            }
          });

          if (exist) {
            failed.push(name);
            continue;
          }

          // Insert subcategory
          await prisma.category.create({
            data: {
              name,
              parentId,
            },
          });
          succeed.push(name);
        } catch (err) {
          failed.push(name);
        }
      }

      return { succeed, failed };
    },
  },
};

module.exports = categoryResolvers;
