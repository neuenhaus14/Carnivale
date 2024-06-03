module.exports = (sequelize, Sequelize) => {
  const Plan = sequelize.define('plan', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    address: Sequelize.STRING,
    startTime: Sequelize.STRING,
    endTime: Sequelize.STRING,
    inviteCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    attendingCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    link: Sequelize.STRING,
    latitude: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    longitude: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
  });

  Plan.associate = function (models) {
    Plan.hasOne(models.content, {
      foreignKey: 'contentableId',
      constraints: false,
      scope: {
        contentableType: 'plan',
      },
    });
  };
  return Plan;
};
