const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const AuthResolvers = require("./resolvers/auth.resolvers");
const AuthTypeDefs = require("./typeDefs/auth.typeDefs");
const categoryTypeDefs = require("./typeDefs/category.typeDefs");
const categoryResolvers = require("./resolvers/category.resolvers");

const allTypeDefs = mergeTypeDefs([categoryTypeDefs]);
const allResolvers = mergeResolvers([categoryResolvers]);

module.exports = { allTypeDefs, allResolvers };
