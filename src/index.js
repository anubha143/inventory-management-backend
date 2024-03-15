const express = require("express");
const mongo = require("./dao/mongo");
const controller = require("./controllers");
const { default: helmet } = require("helmet");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

app.use("/api", controller);

app.listen(port, async () => {
  await mongo();
  console.log("Server is listening on port 3000");
});
