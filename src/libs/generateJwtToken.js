const { sign: JwtSign } = require("jsonwebtoken");

const generateJwtToken = async (claims) => {
  return new Promise((resolve, reject) => {
    JwtSign(
      claims,
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
        issuer: "inventory_management",
        notBefore: "-5s",
        audience: "inventory_management",
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};
generateJwtToken({ name: "test", email: "xxxxxxx" })
  .then((token) => console.log(token))
  .catch((err) => console.log(err));

module.exports = generateJwtToken;
