const categoryTypeDefs = `
  type Category {
    id: ID!
    name: String!
    parent_id: ID
  }

  type Query {
    categories: [Category]           # get all categories
    category(id: ID!): Category      # get single category by id
  }

  type Mutation {
    createCategories(name: String!): Category
    deleteCategories(id: ID!): Category
    }
    `;
    
    module.exports = categoryTypeDefs;
    // createSubCategory(id: ID!): Boolean