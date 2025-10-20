const AuthTypeDefs = `#graphql
    type User{
        id: ID!
        name: String
        email: String
        role: String
    }

    type AuthPayload{
        token: String
        user: User
    }

    type Message {
        message: String
    }

    input RegisterInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

   type Query {
        me: User
   }

   type Mutation {
    register(input:RegisterInput): Message!
    login(input:LoginInput): AuthPayload
   }
`;

module.exports = AuthTypeDefs;
