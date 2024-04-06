module.exports = (sequelize, Sequelize) => {
  // console.log('USER_VOTE!');
  const User_vote = sequelize.define('user_vote', {
    vote: Sequelize.ENUM('up', 'down', 'none'),
  });

  User_vote.associate = function (models) {
    User_vote.belongsTo(models.user, {
      foreignKey: 'userId'
    })
    User_vote.belongsTo(models.content, {
      foreignKey: 'contentId'
    })
  }
  return User_vote;
};
