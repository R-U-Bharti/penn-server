const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const contextMiddleware = ({ req }) => {
  const authHeader = req.headers.authorization;

  const query = req.body.query || "";

  // Skip auth for auth resolvers
  const isPublicResolver =
    query.includes("login") || query.includes("register");

  if (isPublicResolver) {
    return {}; // No auth required
  }

  if (!authHeader)
    throw new GraphQLError("Authorization header missing", {
      extensions: { code: "UNAUTHENTICATED" },
    });

  const token = authHeader.split(" ")[1];
  if (!token)
    throw new GraphQLError("Token missing", {
      extensions: { code: "UNAUTHENTICATED" },
    });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return { user };
  } catch {
    throw new GraphQLError("Invalid or expired token", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

module.exports = contextMiddleware;
