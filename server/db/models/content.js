module.exports = (sequelize, Sequelize) => {
  const Content = sequelize.define('content', {
    latitude: Sequelize.DECIMAL,
    longitude: Sequelize.DECIMAL,
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    placement: {
      type: Sequelize.ENUM('public', 'private', 'ad', 'system'),
      allowNull: false,
    },
    // photoId: Sequelize.INTEGER,
    // commentId: Sequelize.INTEGER,
    // planId: Sequelize.INTEGER,
    // pinId: Sequelize.INTEGER,
    contentableType: Sequelize.STRING,
    contentableId: Sequelize.INTEGER,
  });

  // For polymorphic loading. See: https://sequelize.org/docs/v6/advanced-association-concepts/polymorphic-associations/
  Content.getContentable = function (options) {
    if (!this.contentableType) return Promise.resolve(null);
    const mixinMethodName = `get${this.contentableType[0].toUpperCase()}${this.contentableType.substr(
      1
    )}`;
    return this[mixinMethodName](options);
  };

  Content.addHook('afterFind', (findResult) => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      if (instance.contentableType === 'pin' && instance.pin !== undefined) {
        instance.contentable = instance.pin;
      } else if (
        instance.contentableType === 'photo' &&
        instance.photo !== undefined
      ) {
        instance.contentable = instance.photo;
      } else if (
        instance.contentableType === 'comment' &&
        instance.comment !== undefined
      ) {
        instance.contentable = instance.comment;
      } else if (
        instance.contentableType === 'plan' &&
        instance.plan !== undefined
      ) {
        instance.contentable = instance.plan;
      }
      // To prevent mistakes:
      delete instance.pin;
      delete instance.dataValues.pin;
      delete instance.photo;
      delete instance.dataValues.photo;
      delete instance.comment;
      delete instance.dataValues.comment;
      delete instance.plan;
      delete instance.dataValues.plan;
    }
  });

  Content.associate = function (models) {
    Content.belongsTo(models.user);

    Content.belongsTo(models.pin, {
      foreignKey: 'contentableId',
      constraints: false,
    });
    Content.belongsTo(models.photo, {
      foreignKey: 'contentableId',
      constraints: false,
    });
    Content.belongsTo(models.comment, {
      foreignKey: 'contentableId',
      constraints: false,
    });
    Content.belongsTo(models.plan, {
      foreignKey: 'contentableId',
      constraints: false,
    });

    Content.belongsToMany(models.tag, { through: 'Content_Tags' });
    Content.hasMany(models.content_tag);
  };
  return Content;
};
