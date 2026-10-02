const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const User = require("../models/User");

// LOGICS
const homePage = asyncWrapper(async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, model: ProductVariant, model: ProductImage },
      ],
    });
    const user = await User.findByPk(req.params.id);
    res.render(
      "home/index",
      { title: "Home Page", products: products, user: user },
      (err, ejs) => {
        if (err) {
          req.flash("error_msg", "Page not found or template error");
        } else {
          req.flash("success_msg", "Home Page loaded successfully!");
        }
        res.send(ejs);
      },
    );
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error: ", error);
    return res.redirect("/api/home/");
  }
});

//
const signupHandler = asyncWrapper(async (req, res) => {
  try {
    res.render("auth/sign-up", { title: "Registration Page" }, (err, ejs) => {
      if (err) {
        req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Home Page loaded successfully!");
      }

      res.send(ejs);
    });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error: ", error);
    return res.redirect("/auth/sign-up");
  }
});

const loginHandler = asyncWrapper(async (req, res) => {
  try {
    res.render("auth/login", { title: "" }, (err, ejs) => {
      if (err) {
        req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Home Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error: ", error);
    return res.redirect("/auth/login");
  }
});

const verifyEmailToken = asyncWrapper(async (req, res) => {
  try {
    res.render("auth/verify-email", { title: "" }, (err, ejs) => {
      if (err) {
        req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Home Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error: ", error);
    return res.redirect("/auth/login");
  }
});

const verifySuccess = asyncWrapper(async (req, res) => {
  try {
    res.render("auth/verify-success", { title: "" }, (err, ejs) => {
      if (err) {
        req.flash("error_msg", "Page not found or template error");
      } else {
        req.flash("success_msg", "Home Page loaded successfully!");
      }
      res.send(ejs);
    });
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Server error: ", error);
    return res.redirect("/auth/login");
  }
});

module.exports = {
  homePage,
  signupHandler,
  loginHandler,
  verifyEmailToken,
  verifySuccess,
};
