module.exports = (sequelize, Sequelize) => {
  // console.log('TAG!')

  const Tag =  sequelize.define('tag', {
    tag: Sequelize.STRING,
  })

  Tag.associate = function(models) {
    Tag.belongsToMany(models.content, {through : models.content_tag});
    Tag.hasMany(models.content_tag);
  }
  return Tag;
}