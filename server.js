// Libararies import
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

// Files import
const { allTypeDefs, allResolvers } = require("./src/graphql/index.js");
const contextMiddleware = require("./src/middlewares/contextMiddleware.js");
const graphqlMiddleware = require("./src/middlewares/graphql.middleware.js");
const router = require("./src/routes/index.js");
const errorHandler = require("./src/middlewares/error.middleware.js");

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

  // Middleware
  app.use(cors()); // cors policy
  app.use(express.json()); // json handler
  app.use(morgan("dev")); // For API log

  // Starting Apollo Server
  await server.start();

  // REST API endpoints
  app.use("/api", router);

  // Global Error Handler
  app.use(errorHandler);

  // ✅ Only GraphQL endpoint
  app.use(
    "/graphql", // baseUrl

    graphqlMiddleware,

    // Middleware for token
    expressMiddleware(server, {
      context: contextMiddleware,
    })
  );

  // Making GraphQL run with app config
  app.listen(PORT, () => {
    console.log(
      `🧠 GraphQL API ready at http://localhost:${PORT}/graphql \n✍️  REST API ready at http://localhost:${PORT}/api`
    );
  });
}

startGraphQLServer();
