module.exports = (sequelize, Sequelize) => {
  // console.log('USER!')
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
    // CONTENT
    User.hasMany(models.content, {
      foreignKey: 'userId'
    });
    // SHARED CONTENT
    User.hasMany(models.shared_content, {
      foreignKey: 'senderId'
    })
    User.hasMany(models.shared_content, {
      foreignKey: 'recipientId'
    })

    // // SHARED CONTENT STATUS
    User.hasMany(models.shared_content_status, {
      foreignKey: 'userId'
    })

    // // VOTES
    User.hasMany(models.user_vote, {
      foreignKey: 'userId'
    })

    // // FRIENDS
    User.hasMany(models.user_friend, {
      foreignKey: 'requesterId'
    })
    User.hasMany(models.user_friend, {
      foreignKey: 'recipientId'
    })

  };
  return User;
};