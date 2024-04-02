module.exports = (sequelize, Sequelize) => {
  const Content = sequelize.define('content', {
    latitude: Sequelize.DECIMAL,
    longitude: Sequelize.DECIMAL,
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    placement: {
      type: Sequelize.ENUM('public', 'private', 'ad', 'system'),
      allowNull: false,
    },
    photoId: Sequelize.INTEGER,
    commentId: Sequelize.INTEGER,
    planId: Sequelize.INTEGER,
    pinId: Sequelize.INTEGER,
  });

  Content.associate = function (models) {
    Content.belongsTo(models.user);

    Content.belongsToMany(models.tag, { through : 'Content_Tags'})
    Content.hasMany(models.content_tag)
  };
  return Content;
};
