const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./src/routes/index.js");
const morgan = require("morgan");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Penn Server API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
