const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./src/routes/index.js");
const morgan = require("morgan");
const path = require('path')
const errorHandler = require("./src/middlewares/error.middleware.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler)

// Root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,'welcome.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
