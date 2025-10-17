const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);

  // Default 500 unless specified
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;