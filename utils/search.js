const { Op } = require("sequelize");

const searchQuery = (keyword, fields) => {
  if (!keyword) return {};

  return {
    [Op.or]: fields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${keyword}%`,
      },
    })),
  };
};

module.exports = searchQuery;
