module.exports = (sequelize, Sequelize) => {
  const Content = sequelize.define("content", {
    contentType: {
      type: Sequelize.ENUM('pin', 'photo', 'comment', 'plan'),
      allowNull: false,
    },
    tokenId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    latitude: Sequelize.DECIMAL,
    longitude: Sequelize.DECIMAL,
    upvotes: {type: Sequelize.INTEGER, defaultValue: 0},
    placement: {type: Sequelize.ENUM('public', 'private', 'ad'), allowNull: false}
  });

  Content.associate = function (models) {
    Content.belongsTo(models.user);
  };
  return Content;
};