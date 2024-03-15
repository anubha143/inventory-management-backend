const { Router } = require("express");
const { timingSafeEqual } = require("node:crypto");
const hashPassword = require("../libs/hashPassword");
const mongo = require("../dao/mongo");
const generateJwtToken = require("../libs/generateJwtToken");

const router = Router();

router.post("/signup", async (req, res) => {
  const body = { ...req.body };

  body.password = await hashPassword(body.password);
  console.log(body);

  const db = await mongo();
  const collection = db.collection("users");
  await collection.insertOne(body);

  delete body.password;

  res.status(200).send(body);
  // save this user to database
});

router.post("/signin", async (req, res) => {
  const body = { ...req.body };

  const db = await mongo();
  const collection = db.collection("users");
  const user = await collection.findOne({ username: body.username });

  if (!user) {
    res.status(401).send("User not found");
    return;
  }

  const salt = user.password.split(":")[1];

  const hash = await hashPassword(body.password, salt);

  timingSafeEqual(Buffer.from(hash), Buffer.from(user.password));

  if (!timingSafeEqual(Buffer.from(hash), Buffer.from(user.password)))
    return res.status(401).send("Invalid Password");

  const token = await generateJwtToken({
    username: user.username,
    role: user.role,
  });

  // if (hash !== user.password) return res.status(401).send("Invalid Password");

  return res.status(200).send({ token });
});

module.exports = router;
