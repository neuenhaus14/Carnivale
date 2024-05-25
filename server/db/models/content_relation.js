// THIS MODEL IS NOT USED, THIS FUNCTIONALITY WAS SUBSUMED BY PARENTID FIELD IN CONTENT TABLE

module.exports = (sequelize, Sequelize) => {
  const Content_relation = sequelize.define('content_relation', {
    parentId: {type: Sequelize.INTEGER, allowNull: false},
    childId: {type: Sequelize.INTEGER, allowNull: false}
  })

  Content_relation.associate = function (models) {
    Content_relation.belongsTo(models.user, {foreignKey: 'parentId'})
    Content_relation.belongsTo(models.user, {foreignKey: 'childId'})
  }
  return Content_relation;
}