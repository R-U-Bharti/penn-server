const productsTypeDefs = `
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    category_id: ID
    images: [String]
  }

  type Query {
    hello: String
    products: [Product]
    product(id: ID!): Product
  }
`;

module.exports = productsTypeDefs;
