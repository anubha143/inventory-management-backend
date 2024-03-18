const { Router } = require("express");
const productController = require("./products");
const orderController = require("./orders");
const authHandler = require("./authentication");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const router = Router();

const publicRoutes = [
  {
    path: "/auth",
    contoller: authHandler,
  },
];

const privateRoutes = [
  {
    path: "/orders",
    contoller: orderController,
  },
  {
    path: "/products",
    contoller: productController,
  },
];

publicRoutes.forEach((route) => {
  router.use(route.path, route.contoller);
});

privateRoutes.forEach((route) => {
  router.use(route.path, [authentication, authorization], route.contoller);
});

module.exports = router;
