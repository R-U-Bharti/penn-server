// Libararies import
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const { ApolloServer } = require("@apollo/server");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { json } = require("body-parser");
const { expressMiddleware } = require("@as-integrations/express5");

// Files import
const categoryTypeDefs = require("./src/graphql/category.schema.js");
const productsTypeDefs = require("./src/graphql/produts.schema.js");
const categoryResolvers = require("./src/graphql/category.resolver.js");
const productsResolvers = require("./src/graphql/products.resolver.js");

dotenv.config(); // env config

const app = express();
const PORT = process.env.PORT || 3000;

// Appending all TypeDefs
const typeDefs = mergeTypeDefs([categoryTypeDefs, productsTypeDefs]);

// Appending all Resolvers
const resolvers = mergeResolvers([categoryResolvers, productsResolvers]);

async function startGraphQLServer() {

  // Creating Apollo server for GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // ✅ enable Apollo Sandbox
  });

  // Using this method will run the api without baseUrl too as this is standalone
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: PORT },
  //   context: async ({ req }) => ({
  //     token: req.headers.authorization || null,
  //   }),
  // });

  // Starting Apollo Server
  await server.start();

  // ✅ Only GraphQL endpoint
  app.use(
    "/graphql", // baseUrl
    cors(), // cors policy
    json(), // json handler
    morgan("dev"), // API log

    // Middleware for token
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization || null,
      }),
    })
  );

  // Making GraphQL run with app config
  app.listen(PORT, () => {
    console.log(`🧠 GraphQL API ready at http://localhost:${PORT}/graphql`);
  });
}

startGraphQLServer();
