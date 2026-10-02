const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/Product");

const adminDashboard = asyncWrapper(async (req, res) => {
  try {
    res.render("admin/admin", { title: "Admin Page" }, (err, ejs) => {
      if (err) {
        return req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Home Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error loading the page: ", error);
  }
});

const productHandler = asyncWrapper(async (req, res) => {
  try {
    const {} = req.body;
    const productImage = req.file.fileName;

    const newProducts = await Product.create({});
  } catch (error) {}
});

module.exports = { adminDashboard, productHandler };
