module.exports = (sequelize, Sequelize) => {
  console.log('SHARED_CONTENT_STATUS!')

  const Shared_content_status = sequelize.define('shared_content_status', {
    isArchived: { type: Sequelize.BOOLEAN, defaultValue: false },
  });

  Shared_content_status.associate = function (models) {
    Shared_content_status.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    Shared_content_status.belongsTo(models.content, {
      foreignKey: 'contentId',
    });
  };
};
