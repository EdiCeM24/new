const cron = require("node-cron");
const { Op } = require("sequelize");

const User = require("../models/User");

const cleanupExpiredUsers = () => {
  const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  cron.schedule(
    "0 * * * *",

    async () => {
      await User.destroy({
        where: {
          isVerified: false,

          verificationTokenExpires: {
            [Op.lt]: new Date(),
          },
          createdAt: {
            [Op.lt]: expirationTime,
          },
        },
      });

      console.log("Expired users cleaned");
    },
  );
};

module.exports = cleanupExpiredUsers;
