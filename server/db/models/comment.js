module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Comment.associate = function (models) {
    // Comment.hasOne(models.content, {
    //   foreignKey : {
    //     name: 'commentId',
    //   },
    // });

    Comment.hasOne(models.content, {
      foreignKey: 'contentableId',
      constraints: false,
      scope: {
        contentableType: 'comment'
      }
    })
  };
  return Comment;
};