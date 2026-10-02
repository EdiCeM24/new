import asyncWrapper from "../middlewares/asyncWrapper";
import Address from "../models/Address";
const { PAYSTACK_SECRET_KEY, SHIPPO_API_KEY } = require("../config/env");
const paystack = require("paystack")(PAYSTACK_SECRET_KEY);
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const shippo = require("shippo")(SHIPPO_API_KEY);

//
export const placeOrder = asyncWrapper(async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
    });

    if (cartItems.length === 0) {
      req.flash("error_msg", "Cart is empty");

      return res.redirect("/api/home");
    }

    const order = await Order.create({
      userId,
      addressId: req.body.addressId,
      paymentId: null,
      status: "pending",
    });

    const orderItems = cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await OrderItem.bulkCreate(orderItems);

    const payment = await Payment.create({
      userId,
      paymentMethod: "paystack",
      paymentStatus: "pending",
    });

    await order.update({ paymentId: payment.id });

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    const paymentResponse = await paystack.transaction.initialize({
      email: req.user.email,
      amount: totalAmount * 100, // convert to kobo
      reference: order.id,
    });

    await payment.update({ paymentStatus: "initialized" });

    req.flash("success_msg", "Your transaction is created successfully!");

    return res.redirect(paymentResponse.data.authorization_url);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Your transaction is not created: ", error);

    return res.redirect("/api/cart"); // to check!
  }
});

// Paystack payment webhook endpoint
export const paystackWebhook = asyncWrapper(async (req, res) => {
  try {
    const event = req.body.event;
    const data = req.body.data;

    if (event === "charge.success") {
      const order = await Order.findOne({ where: { id: data.reference } });
      const payment = await Payment.findOne({ where: { id: order.paymentId } });

      await Payment.update({ paymentStatus: "success" });
      await order.update({ status: "paid" });

      // clear Cart
      await Cart.destroy({ where: { userId: order.userId } });

      req.flash("success_msg", "Payment was successful!");

      return res.redirect("/api");
    }
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Payment was unsuccessfull: ", error);

    return res.redirect("/api/cart");
  }
});

// Error to handle: edge cases such as invalid addresses, failed shipment, etc.
// SHIPPMENT AGENT
export const shipOrder = asyncWrapper(async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ model: Address }],
    });

    if (!order) {
      req.flash("error_msg", "Order not found!");

      return res.redirect("/api/home");
    }

    const address = order.Address;

    const shipment = await shippo.shipment.create({
      address_from: {
        name: "Your Company",
        street1: "123 Ndigbo street",
        city: "Owerri",
        state: "Imo",
        zip: "12345",
        country: "Nigeria",
      },
      address_to: {
        name: address.name,
        street1: address.address,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      parcels: [
        {
          length: "10",
          width: "5",
          height: "5",
          distance_unit: "in",
          weight: "1",
          mass_unit: "1b",
        },
      ],
    });

    const shippingLabel = await shippo.transaction.create({
      rate: shipment.rates[0].object_id,
      label_file_type: "PDF",
    });

    req.flash("success_msg", "Your shipment placed successfully!");
    res.send(shippingLabel.label_url);
  } catch (error) {
    console.log(error);

    req.flash("error_msg", "Error in placing your shipment: ", error);

    return res.redirect("/api/"); // To be checked!
  }
});

export const updateDeliveryStatus = asyncWrapper(async (req, res) => {
  try {
    const trackingNumber = req.body.tracking_number;
    const status = req.body.status;

    const shipment = await shippo.track.get(trackingNumber);
    const order = await Order.findOne({ where: { trackingNumber } });

    if (!order) {
      req.flash("error_msg", "Order not found!");

      return res.redirect("/api/");
    }

    if (status === "Delivered") {
      await order.update({ status: "delivered" });
      // Send notification to customer
      //...
    } else if (status === "Failed") {
      await order.update({ status: "failed" });
      // Send notification to customer
      //...
    }

    req.flash("success_msg", "Delivery status updated successfully!");

    return res.redirect("/api/home");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Failed to deliver successfully: ", error);
    return res.redirect("/api/home");
  }
});

// Shippo Webhook endpoint
export const shippoWebhook = asyncWrapper(async (req, res) => {
  try {
    const event = req.body.event;
    const data = req.body.data;

    if (event === "track_updated") {
      const trackingNumber = data.tracking_number;
      const status = data.status;

      await updateDeliveryStatus(trackingNumber, status);
    }

    req.flash("success_msg", "Shipment status updated successfully!");
    return res.status(200).send("Webhook received");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error in updating shipment status: ", error);
    return res.status(500).send("Error processing webhook");
  }
});
