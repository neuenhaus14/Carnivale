module.exports = (sequelize, Sequelize) => {
  // console.log('USER_PLAN!')

  const User_plan = sequelize.define('user_plan', {
    status: Sequelize.ENUM('pending', 'accepted', 'denied')
  })
  User_plan.associate = function (models) {
    User_plan.belongsTo(models.content, {
      foreignKey: 'contentId'
    })
    User_plan.belongsTo(models.user, {
      foreignKey: 'userId'
    })
    // User_plan.belongsTo(models.user, {
    //   foreignKey: 'inviterId'
    // })
  }
  return User_plan;
}