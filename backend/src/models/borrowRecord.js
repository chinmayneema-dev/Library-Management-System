module.exports = (sequelize, DataTypes) => {
  const BorrowRecord = sequelize.define(
    'BorrowRecord',
    {
      borrowId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'borrow_id',
      },
      issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'issue_date',
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'due_date',
      },
      returnDate: {
        type: DataTypes.DATEONLY,
        field: 'return_date',
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'member_id',
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'book_id',
      },
      status: {
        type: DataTypes.ENUM('ISSUED', 'RETURNED'),
        allowNull: false,
        defaultValue: 'ISSUED',
      },
    },
    {
      tableName: 'borrow_records',
      timestamps: true,
      indexes: [
        {
          fields: ['member_id'],
        },
        {
          fields: ['book_id'],
        },
      ],
    }
  );

  return BorrowRecord;
};







