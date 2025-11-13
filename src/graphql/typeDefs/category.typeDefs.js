const categoryTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    parent_id: ID
    parentCategory: String
  }

  type SubCategoryResponse {
  succeed: [String!]!
  failed: [String!]!
}

  type Query {
    allCategory: [Category]           # get all categories
  }

  type Mutation {
    categoryById(id: ID!): Category      # get category by id
    subCaegoryList(parentId: ID!): [Category]
    createCategory(name: String!): Category
    deleteCategory(id: ID!): String
    createSubCategory(parentId: String!, subCategories: [String]!): SubCategoryResponse!
    }
    `;

module.exports = categoryTypeDefs;
