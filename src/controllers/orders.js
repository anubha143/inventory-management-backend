const { Router } = require("express");
const mongo = require("../dao/mongo");
const { ObjectId } = require("mongodb");

const router = Router();

// Admin, Customer, Driver
router.get("/", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const orders = await coll.find({}).toArray();
  res.status(200).send(orders);
});

// Admin, Customer, Driver
router.get("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.find({ _id: new ObjectId() }).toArray();
  res.status(200).send(order);
});

// Admin, Customer
router.post("/:id/cancel", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Canceled" } }
  );
  res.status(201).send(order);
});

// Admin, Driver
router.post("/:id/in-transit", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("orders");
  const order = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "In-Transit" } }
  );
  res.status(201).send(order);
});

// Admin, Driver
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
