const amqlib = require("amqplib");

let connection = null;
let channel = null;

const RABBITMQ_CONNECTION_URL = process.env.RABBITMQ_CONNECTION_URL;

const publishEvent = async (event) => {
  connection = connection ?? (await amqlib.connect(RABBITMQ_CONNECTION_URL));
  channel = channel ?? (await connection.createChannel());
  channel.assertQueue("notification");
  channel.sendToQueue("notification", Buffer.from(JSON.stringify(event)));
  console.log("[x] sent %s", JSON.stringify(event));
};

module.exports = publishEvent;
