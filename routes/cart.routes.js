const express = require("express");
const { getCart } = require("../controllers/cart.controller");

const cartRouter = express.Router();

cartRouter.get("/cart", getCart);

module.exports = cartRouter;
