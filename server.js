// Libararies import
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const { ApolloServer } = require("@apollo/server");
const { json } = require("body-parser");
const { expressMiddleware } = require("@as-integrations/express5");

// Files import
const { allTypeDefs, allResolvers } = require("./src/graphql/index.js");
const contextMiddleware = require("./src/middlewares/contextMiddleware.js");

dotenv.config(); // env config

const app = express();
const PORT = process.env.PORT || 3000;

async function startGraphQLServer() {
  // Creating Apollo server for GraphQL
  const server = new ApolloServer({
    typeDefs: allTypeDefs,
    resolvers: allResolvers,
    introspection: true, // ✅ enable Apollo Sandbox
    nodeEnv: "development",
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
      context: contextMiddleware,
    })
  );

  // Making GraphQL run with app config
  app.listen(PORT, () => {
    console.log(`🧠 GraphQL API ready at http://localhost:${PORT}/graphql`);
  });
}

startGraphQLServer();
