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
    { $set: { status: "Cancelled" } }
  );
  res.status(201).send(order);
  publishEvents({
    type: "order-cancelled",
    data: {
      id: req.params.id,
      status: "Canceled",
    },
  });
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
  publishEvents({
    type: "order-in-transit",
    data: {
      id: req.params.id,
      status: "InTransit",
    },
  });
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
  publishEvents({
    type: "order-delivered",
    data: {
      id: req.params.id,
      status: "Delivered",
    },
  });
});

module.exports = router;
