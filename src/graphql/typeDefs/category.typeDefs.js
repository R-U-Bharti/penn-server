const categoryTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    parent_id: ID
  }

  type SubCategoryResponse {
  succeed: [String!]!
  failed: [String!]!
}

input CreateSubCategoryInput {
  parentId: Int!
  subCategories: [String!]!
}

  type Query {
    allCategory: [Category]           # get all categories
    categoryById(id: ID!): Category      # get single category by id
  }

  type Mutation {
    createCategory(name: String!): Category
    deleteCategory(id: ID!): String
    createSubCategory(input: CreateSubCategoryInput!): SubCategoryResponse!
    }
    `;

module.exports = categoryTypeDefs;
