module.exports = (sequelize, Sequelize) => {
  console.log('CONTENT TAG!')
    const Content_tag = sequelize.define('content_tag', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
    });
    
    Content_tag.associate = function (models) {
      Content_tag.belongsTo(models.content);
      Content_tag.belongsTo(models.tag);
    }
    return Content_tag;
  };
