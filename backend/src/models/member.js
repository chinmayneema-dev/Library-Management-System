module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      memberId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'member_id',
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
      },
      membershipDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'membership_date',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'members',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );

  return Member;
};







