module.exports = (sequelize, Sequelize) => {
  console.log('PHOTO!');
  const Photo = sequelize.define('photo', {
    photoURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Photo.associate = function (models) {
    // Photo.hasOne(models.content, {
    //   foreignKey : {
    //     name: 'photoId',
    //   },
    // });

    Photo.hasOne(models.content, {
      foreignKey: 'contentableId',
      constraints: false,
      scope: {
        contentableType: 'photo',
      },
    });
  };
  return Photo;
};
