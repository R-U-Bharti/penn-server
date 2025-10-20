const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const queries = {
  me: async (_, __, { user }) => {
    if (!user) throw new Error("Not authenticated.");
    return await prisma.users.findUnique({ where: { id: user.id } });
  },
};

const mutations = {
  register: async (_, { input }) => {
    const { name, email, password } = input;

    if (!name || !email || !password) throw new Error("All fields required.");

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) throw new Error("Email already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer",
      },
    });

    return { message: "Registered Successfully." };
  },

  login: async (_, { input }) => {
    const { email, password } = input;

    if (!email || !password) throw new Error("Email and Password required.");

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error("User does not exist.");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Password Invalid.");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d", algorithm: "HS256" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};

const AuthResolvers = {
  Query: queries,
  Mutation: mutations,
};

module.exports = AuthResolvers;
