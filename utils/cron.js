const { SHIPPO_API_KEY } = require("../config/env");
const asyncWrapper = require("../middlewares/asyncWrapper");
const shippo = require("shippo")(SHIPPO_API_KEY);
const Order = require("../models/Order");

const updateTrackingUpdates = asyncWrapper(async () => {
  try {
    const orders = await Order.findAll({ where: { status: "shipped" } });

    orders.forEach(async (order) => {
      const trackingNumber = order.trackingNumber;
      const shipment = await shippo.track.get(trackingNumber);

      const status = shipment.status;

      if (status === "DELIVERED") {
        // await order.update({ status: delivered }); // formerly "delivered" was a string, now it's a variable. If you meant to use the string, it should be in quotes.
        await order.update({ status: "delivered" });
        // send notification to customer
        // ...
      } else if (status === "FAILED") {
        await order.update({ status: "failed" });

        // send notification to customer
        // ...
      }
    });
  } catch (error) {
    console.log(error);
  }
});

updateTrackingUpdates();
