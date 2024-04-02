module.exports = (sequelize, Sequelize) => {
  const Tag =  sequelize.define('tag', {
    tag: Sequelize.STRING,
  })

  Tag.associate = function(models) {
    Tag.belongsToMany(models.content, {through : 'Content_Tags'});
    Tag.hasMany(models.content_tag);
  }
  return Tag;
}