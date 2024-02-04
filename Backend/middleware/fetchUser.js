const jwt = require("jsonwebtoken");

const JWT_SECRET = "vamsiisnice";
const fetchUser = (req, res, next) => {
  // Get the user from the Jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ Error: "Please login again" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ Error: "Please login again1" });
  }
};

module.exports = fetchUser;
