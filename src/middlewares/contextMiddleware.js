const contextMiddleware = ({ req, res, next }) => {
  // console.log(req.headers);
  // next();

  return {data: {a: 1}}
};

module.exports = contextMiddleware;
