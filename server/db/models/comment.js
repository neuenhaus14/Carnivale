module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Comment.associate = function (models) {
    Comment.hasOne(models.content, {
      foreignKey : {
        name: 'commentId',
      },
    });
  };
  return Comment;
};