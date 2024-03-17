const { Router } = require("express");
const mongo = require("../dao/mongo");
const { ObjectId } = require("mongodb");

const router = Router();

const validRoles = {
  admin: true,
  customer: true,
  driver: true,
};

// Admin, Customer, Driver
router.get("/", async (req, res) => {
  if (validRoles[res.locals.user.role]) {
    const db = await mongo();
    const coll = db.collection("orders");
    const orders = await coll.find({}).toArray();
    res.status(200).send(orders);
  } else res.status(400).send("You are not authorized to view this page");
});

// Admin, Customer, Driver
router.get("/:id", async (req, res) => {
  if (validRoles[res.locals.user.role]) {
    const db = await mongo();
    const coll = db.collection("orders");
    const order = await coll.find({ _id: new ObjectId() }).toArray();
    res.status(200).send(order);
  } else res.status(400).send("You are not authorized to view this page");
});

// Admin, Customer
router.post("/:id/cancel", async (req, res) => {
  if (validRoles[res.locals.user.role]) {
    const db = await mongo();
    const coll = db.collection("orders");
    const order = await coll.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "Canceled" } }
    );
    res.status(201).send(order);
  } else res.status(400).send("You are not authorized to view this page");
});

router.post("/:id/in-transit", async (req, res) => {
  if (validRoles[res.locals.user.role]) {
    const db = await mongo();
    const coll = db.collection("orders");
    const order = await coll.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "In-Transit" } }
    );
    res.status(201).send(order);
  } else res.status(400).send("You are not authorized to view this page");
});

// Admin, Driver
router.post("/:id/delivered", async (req, res) => {
  if (validRoles[res.locals.user.role]) {
    const db = await mongo();
    const coll = db.collection("orders");
    const order = await coll.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "Delivered" } }
    );
    res.status(201).send(order);
  } else res.status(400).send("You are not authorized to view this page");
});

module.exports = router;
