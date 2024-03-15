const { verify: JwtVerify } = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const token = authorizationHeader.split(" ")[1];

    const JWT_SECRET = process.env.JWT_SECRET;

    const payload = JwtVerify(token, JWT_SECRET);

    res.locals.user = payload;

    console.log("PAYLOAD", payload);

    next();
  } catch (error) {
    res.status(403).send("Not Authorized");
  }
};

module.exports = authentication;
