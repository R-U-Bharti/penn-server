const { GraphQLError } = require("graphql");
const prisma = require("../config/prisma");

const getAllCategory = async () => {
  const data = prisma.categories.findMany();
  return data;
};

const getCategoryById = async (_, { id }) => {
  if (!id) return GraphQLError("ID required.");

  const data = prisma.categories.findFirst({ where: { id: id } });
  return data;
};

const createCategory = async(_, {name}) => {
    
}