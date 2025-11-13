const { GraphQLError } = require("graphql");
const prisma = require("../config/prisma");

/*
@ Get all categories (with subcategories)
*/
const getAllCategory = async () => {
  const data = prisma.categories.findMany();
  return data;
};

const getCategoryById = async (_, { id }) => {
  if (!id) return GraphQLError("ID required.");

  const data = prisma.categories.findFirst({ where: { id: id } });
  return data;
};

const getSubCategoryList = async (_, { parentId }) => {
  if (!parentId) return GraphQLError("Parent ID required.");

  const parent = await prisma.categories.findFirst({ where: { id: parentId } });
  const data = await prisma.categories.findMany({
    where: { parent_id: parentId },
  });

  const result = data.map(sub => ({ ...sub, parentCategory: parent.name }));

  return result;
};

const createCategory = async (_, { name }) => {
  const category = await prisma.categories.create({
    data: {
      name: name.trim(),
    },
  });
  return category;
};

const deleteCategory = async (_, { id }) => {
  await prisma.categories.deleteMany({
    where: { OR: [{ id: id }, { parent_id: id }] },
  });
  return "Deleted Successfully.";
};

const createSubCategory = async (_, { parentId, subCategories }) => {
  if (
    !parentId ||
    !Array.isArray(subCategories) ||
    subCategories.length === 0
  ) {
    throw new Error("Invalid input.");
  }

  // Check if parent category exists
  const parent = await prisma.categories.findUnique({
    where: { id: parentId },
  });
  if (!parent) {
    throw new Error("Parent category not found.");
  }

  // Remove duplicates & trim
  const uniqueSubs = [
    ...new Set(
      subCategories.filter(item => item.length > 0).map(name => name.trim())
    ),
  ];

  const succeed = [];
  const failed = [];

  for (const name of uniqueSubs) {
    try {
      // Check if subcategory already exists under the parent
      const exist = await prisma.categories.findFirst({
        where: {
          parent_id: { equals: parentId },
          name: { equals: name, mode: "insensitive" }, // case-insensitive check
        },
      });

      if (exist) {
        failed.push(name);
        continue;
      }

      // Insert subcategory
      await prisma.categories.create({
        data: {
          name: name,
          parent_id: parentId,
        },
      });
      succeed.push(name);
    } catch (err) {
      failed.push(name);
    }
  }

  return { succeed, failed };
};

module.exports = {
  getAllCategory,
  getCategoryById,
  createCategory,
  deleteCategory,
  createSubCategory,
  getSubCategoryList,
};
