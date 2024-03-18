const { ObjectId } = require("mongodb");
const accessRules = require("../utils/accessRules");

const authorization = async (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("Route: ", req.originalUrl);
  console.log("Role: ", res.locals.user.role);
  const finalUrl = req.originalUrl
    .split("/")
    .map((str) => (ObjectId.isValid(str) ? "{{id}}" : str))
    .join("/");
  try {
    if (accessRules[finalUrl]?.[req.method]?.includes(res.locals.user.role))
      next();
    else throw new Error();
  } catch (error) {
    res.status(403).send({ error: "You are not authorized to view this page" });
  }
};

module.exports = authorization;
