// controllers/cartController.js
const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = asyncWrapper(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    req.flash("error_msg", "Product not found!");

    return res.redirect("/api/");
  }

  const cartItem = await Cart.findOne({
    where: { productId, userId: req.user.id },
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    await Cart.create({ productId, userId: req.user.id, quantity });
  }

  res.redirect("/cart");
});

// INCREMENT BUTTON LOGIC
const incremenQuantity = asyncWrapper(async (req, res) => {
  try {
    const { productId } = req.body;
    const cartItem = await Cart.findOne({
      where: { productId, userId: req.user.id },
    });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    }

    return res.redirect("/api/cart");
  } catch (error) {
    console.log(error);

    return res.redirect("/api/home");
  }
});

// DECREMENT BUTTON LOGIC
const decrementQuantity = asyncWrapper(async (req, res) => {
  try {
    const { productId } = req.body;
    const cartItem = await Cart.findOne({
      where: { productId, userId: req.user.id },
    });

    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    } else if (cartItem && cartItem.quantity === 1) {
      await cartItem.destroy();
    }
    return res.redirect("/api/cart");
  } catch (error) {
    console.log(error);
    return res.redirect("/api/home");
  }
});

// Calculate Total Amount and Quantity LOGIC
const getCart = asyncWrapper(async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
    });
    let totalAmount = 0;
    let totalQuantity = 0;
    cartItems.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
      totalQuantity += item.quantity;
    });

    res.render("cart", { cartItems, totalAmount, totalQuantity });
  } catch (error) {
    console.log(error);
    res.redirect("/api/home");
  }
});

module.exports = { addToCart, getCart, incremenQuantity, decrementQuantity };
