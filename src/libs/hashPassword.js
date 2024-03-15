const { scrypt, randomBytes } = require("node:crypto");

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    salt = salt ?? randomBytes(16).toString("base64");
    scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${derivedKey.toString("base64")}:${salt}`);
    });
  });
};

module.exports = hashPassword;
