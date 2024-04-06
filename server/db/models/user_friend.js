module.exports = (sequelize, Sequelize) => {
  console.log('USER_FRIEND!');

  const User_friend = sequelize.define('user_friend', {
    status: {
      type: Sequelize.ENUM('pending', 'accepted', 'denied', 'blocked'),
      allowNull: false,
    },
  });

  User_friend.associate = function (models) {
    User_friend.belongsTo(models.user, {
      foreignKey: 'requesterId',
    });
    User_friend.belongsTo(models.user, {
      foreignKey: 'recipientId',
    });
  };
};
