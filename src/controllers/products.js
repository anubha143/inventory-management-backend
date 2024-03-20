const { Router } = require("express");
const mongo = require("../dao/mongo");
const { ObjectId } = require("mongodb");
const addFormats = require("ajv-formats");

const Ajv = require("ajv");
const schema_product = require("../dto/products.json");
const schema_order_product = require("../dto/orders.json");
const publishEvent = require("../libs/publishEvents");
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate_product = ajv.compile(schema_product);
const validate_order_product = ajv.compile(schema_order_product);

const router = Router();

const validRoles = {
  admin: true,
  customer: true,
  driver: true,
};

// Admin, Customer
router.get("/", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const products = await coll.find({}).toArray();
  res.status(200).send(products);
});

// Admin, Customer
router.get("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const products = await coll.find({ _id: new ObjectId() }).toArray();
  res.status(200).send(products);
});

// Admin
router.post("/", async (req, res) => {
  if (validate_product(req.body)) {
    const db = await mongo();
    const coll = db.collection("products");
    const products = await coll.insertMany([req.body].flat());
    res.status(201).send(products);
  } else {
    res.status(400).send(validate_product.errors);
  }
});

// Admin
router.put("/:id", async (req, res) => {
  if (validate_product(req.body)) {
    const db = await mongo();
    const coll = db.collection("products");
    const product = await coll.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body } }
    );
    res.status(201).send(product);
  } else {
    res.status(400).send(validate_product.errors);
  }
});

// Admin
router.delete("/:id", async (req, res) => {
  const db = await mongo();
  const coll = db.collection("products");
  const product = await coll.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(201).send(product);
});

// Customer
router.post("/:id/order", async (req, res) => {
  if (validate_order_product(req.body)) {
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

    const [insertOrderResult, updateOrderResult] = await Promise.all([
      orderCollection.insertOne(order),
      productCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: { quantity: product.quantity - req.body.quantity } }
      ),
    ]);
    publishEvent({
      type: "order-placed",
      data: {
        id: insertOrderResult.insertedId,
        status: "Scheduled",
      },
    });
    return res.status(200).send(order);
  } else {
    res.status(400).send(validate_order_product.errors);
  }
});

module.exports = router;
