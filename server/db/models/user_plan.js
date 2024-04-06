module.exports = (sequelize, Sequelize) => {
  console.log('USER_PLAN!')

  const User_plan = sequelize.define('user_plan', {
    status: Sequelize.ENUM('pending', 'accepted', 'denied')
  })
  User_plan.associate = function (models) {
    User_plan.belongsTo(models.plan, {
      foreignKey: 'planId'
    })
    User_plan.belongsTo(models.user, {
      foreignKey: 'recipientId'
    })
    User_plan.belongsTo(models.user, {
      foreignKey: 'inviterId'
    })
  }
}