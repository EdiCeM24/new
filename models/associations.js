// Associations
const Address = require("./Address");
const Cart = require("./Cart");
// const CartItem = require("./CartItems");
const Category = require("./Category");
const Checkout = require("./Checkout");
const Contact = require("./Contact");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const Product = require("./Product");
const User = require("./User");
const ProductVariant = require("./ProductVariant");
const ProductImage = require("./ProductImage");
const LoginDevice = require("./loginDevice");

// Define associations here
const associations = () => {
  // #========== USER -> ADDRESS RELATIONSHIP ==========#
  User.hasMany(Address);
  Address.belongsTo(User);

  // #========== USER -> ORDER RELATIONSHIP ==========#
  User.hasMany(Order);
  Order.belongsTo(User);

  // #========== User -> Contact RELATIONSHIP ==========#
  User.hasMany(Contact);
  Contact.belongsTo(User);

  // #========== User -> LoginDevice RELATIONSHIP ==========#
  User.hasMany(LoginDevice);
  LoginDevice.belongsTo(User);

  // #========== USER -> PAYMENT RELATIONSHIP ==========#
  // User.hasMany(Payment);
  // Payment.belongsTo(User);

  // #========== CATEGORY -> PRODUCT RELATIONSHIP ==========#
  Category.belongsToMany(Product, {
    through: "ProductCategories",
    foreignKey: "categoryId",
    onDelete: "CASCADE",
  });
  Product.belongsToMany(Category, {
    through: "ProductCategories",
    foreignKey: "categoryId",
  });

  // #========== PRODUCT -> CART RELATIONSHIP ==========#
  Product.belongsToMany(Cart, { through: "productId" });
  Cart.belongsToMany(Product, { through: "productId" });

  // #========== Category -> ProductVariant RELATIONSHIP ==========#
  Category.belongsToMany(ProductVariant, { through: "productId" });
  ProductVariant.belongsToMany(Category, { through: "productId" });

  // #========== USER -> CART RELATIONSHIP ==========#
  User.hasMany(Cart);
  Cart.belongsTo(User);

  // #========== ORDER -> ORDERITEM RELATIONSHIP ==========#
  Order.hasMany(OrderItem);
  OrderItem.belongsTo(Order);

  // #========== ORDER -> PRODUCT RELATIONSHIP ==========#
  Order.hasMany(Product, { through: OrderItem, foreignKey: "orderId" });
  Product.belongsTo(Order, { through: OrderItem, foreignKey: "productId" });

  // #========== PRODUCT -> ORDERITEM RELATIONSHIP ==========#
  Product.hasMany(OrderItem, { foreignKey: "productId" });
  OrderItem.belongsTo(Product, { foreignKey: "productId" });

  // #========== PRODUCTVariant -> ORDERITEM RELATIONSHIP ==========#
  ProductVariant.hasMany(OrderItem);
  OrderItem.belongsTo(ProductVariant);

  // #========== ORDER -> ADDRESS RELATIONSHIP ==========#
  Order.belongsTo(Address);
  Address.hasMany(Order);

  // #========== ORDER -> USER RELATIONSHIP ==========#
  Order.belongsTo(User);
  User.hasMany(Order);

  // #========== ORDER -> PAYMENT RELATIONSHIP ==========#
  Order.belongsTo(Payment, { foreignKey: "paymentId" });
  Payment.hasMany(Order, { foreignKey: "paymentId" });

  // #========== ORDER -> CHECKOUT RELATIONSHIP ==========#
  Order.hasOne(Checkout);
  Checkout.belongsTo(Order);

  // #========== Product -> ProductVariant RELATIONSHIP ==========#

  Product.hasMany(ProductVariant);
  ProductVariant.belongsTo(Product);

  // #========== Product -> ProductImage RELATIONSHIP ==========#
  Product.hasMany(ProductImage);
  ProductImage.belongsTo(Product);

  // #========== ProductImage -> ProductVariant RELATIONSHIP ==========#
  ProductImage.hasMany(ProductVariant, { foreignKey: "productImageId" });
  ProductVariant.belongsTo(ProductImage, { foreignKey: "productImageId" });

  // #========== Cart -> CartItem RELATIONSHIP ==========#
  Cart.belongsToMany(ProductVariant, { through: "CartItems" });
  ProductVariant.belongsToMany(Cart, { through: "CartItems" });

  // #========== Product -> CartItem RELATIONSHIP ==========#
  // Product.hasMany(CartItem, { foreignKey: "productId" });
  // CartItem.belongsTo(Product, { foreignKey: "productId" });
};

//

//
module.exports = {
  associations,
  Address,
  Cart,
  Category,
  Checkout,
  Contact,
  Order,
  OrderItem,
  Product,
  Payment,
  ProductImage,
  ProductVariant,
  LoginDevice,
  User,
};
