const accessRules = {
  "/api/products/{{id}}/order": {
    POST: ["customer"],
  },
  "/api/products": {
    GET: ["customer", "admin"],
    POST: ["admin"],
  },
  "/api/products/{{id}}": {
    GET: ["customer", "admin"],
    POST: ["admin"],
    DELETE: ["admin"],
  },
  "/api/orders": {
    GET: ["admin", "customer", "driver"],
  },
  "/api/orders/{{id}}": {
    GET: ["admin", "customer", "driver"],
  },
  "/api/orders/{{id}}/cancel": {
    POST: ["admin", "customer"],
  },
  "/api/orders/{{id}}/in-transit": {
    POST: ["admin", "driver"],
  },
  "/api/orders/{{id}}/delivered": {
    POST: ["admin", "driver"],
  },
};

module.exports = accessRules;
