const bcryptSalt = require("bcryptjs");
const sequelize = require("../database/db.js");
const User = require("../models/User.model.js");
const { Op } = require("sequelize");

(async () => {
  await sequelize.sync();

  const salt = await bcryptSalt.genSalt(12);

  const admin = await User.findOne({
    where: {
      [Op.or]: [{ role: "super_admin" }, { role: "admin" }],
    },
  });

  if (!admin) {
    const hashedPassword = await bcryptSalt.hash(password, salt);

    await User.create({
      usename,
      email,
      password: hashedPassword,
      role: admin,
    });

    req.flesh("success_msg", "Super user created successfully!");
  }

  process.exit(1); // added 1 in it.
})();
