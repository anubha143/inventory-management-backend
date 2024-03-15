const { Router } = require("express");
const mongo = require("../dao/mongo");
const { ObjectId } = require("mongodb");

const router = Router();

router.get("/", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const products = await coll.find({}).toArray();
  res.status(200).send(products);
});

router.get("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const products = await coll.find({ _id: new ObjectId() }).toArray();
  res.status(200).send(products);
});

router.post("/", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const products = await coll.insertMany([req.body].flat());
  res.status(201).send(products);
});

router.put("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const product = await coll.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { ...req.body } }
  );
  res.status(201).send(product);
});

router.delete("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const product = await coll.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(201).send(product);
});

router.post("/:id/order", async (req, res) => {
  const productId = req.params.id;
  const db = await mongo();
  const productCollection = db.collection("products");
  const orderCollection = db.collection("orders");
  const product = await productCollection.findOne({
    _id: new ObjectId(productId),
  });
  if (product.quantity < req.body.quantity)
    return res
      .status(404)
      .send(`Maximum order you can order is ${product.quantity}`);

  const total_cost = req.body.quantity * product.cost_per_unit;

  const order = { ...req.body, productId, total_cost, status: "Scheduled" };

  await Promise.all([
    orderCollection.insertOne(order),
    productCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { quantity: product.quantity - req.body.quantity } }
    ),
  ]);

  return res.status(200).send(order);
});

module.exports = router;
