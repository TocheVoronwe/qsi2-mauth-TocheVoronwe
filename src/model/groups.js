const {Users} = require('../model');

module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Group ID',
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        comment: 'Group title',
        allowNull: false,
        set(val) {
          this.setDataValue('title',
            val);
        }
      },
      description: {
        type: DataTypes.STRING,
        comment: 'Group description',
        allowNull: false
      },
      data: {
        type: DataTypes.JSON,
        description: 'Group data'
      }
    }
  );



Groups.associate = models => {
  Groups.belongsTo(models.Users, {as: 'owner'});
  Groups.belongsToMany(models.Users, {through: 'Members'});
/*  Groups.hasOne(models.Users, {as: 'Owner', foreignKey: models.Users});
  Groups.hasMany(models.Users, {as: 'Members', foreignKey: models.Users});*/
};

  return Groups;
};