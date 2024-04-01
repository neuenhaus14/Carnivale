import { PIN_TYPES } from "../../config";

const PIN_TYPES_ARRAY = PIN_TYPES.split(' ')

module.exports = (sequelize, Sequelize) => {
  const Pin = sequelize.define("pin", {
    pinType: {
      type: Sequelize.ENUM(),
      allowNull: false,
    },
    photoUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Pin.associate = function (models) {
    Pin.belongsTo(models.content);
  };
  return Pin;
};