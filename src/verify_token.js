const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Access Denied");
  }
};

module.exports = verifyToken;
