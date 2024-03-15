const { Router } = require("express");
const mongo = require("../dao/mongo");
const { ObjectId } = require("mongodb");

const router = Router();

router.get("/", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const orders = await coll.find({}).toArray();
  res.status(200).send(orders);
});

router.get("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.find({ _id: new ObjectId() }).toArray();
  res.status(200).send(order);
});

router.post("/:id/cancel", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Canceled" } }
  );
  res.status(201).send(order);
});

router.post("/:id/in-transit", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "In-Transit" } }
  );
  res.status(201).send(order);
});

router.post("/:id/delivered", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Delivered" } }
  );
  res.status(201).send(order);
});

module.exports = router;
