module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    phone: Sequelize.STRING,
    latitude: Sequelize.DECIMAL,
    longitude: Sequelize.DECIMAL,
    shareLoc: Sequelize.BOOLEAN
  });

  User.associate = function (models) {
    User.hasMany(models.content);
  };
  return User;
};