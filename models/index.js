const defineAssociations = require("./associations");

const sequelize = require("../database/db");

//
defineAssociations();

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.log("Wrong synced", error);
  });
