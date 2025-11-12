module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      bookId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'book_id',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(100),
      },
      publisher: {
        type: DataTypes.STRING(150),
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'ISSUED'),
        defaultValue: 'AVAILABLE',
        allowNull: false,
      },
    },
    {
      tableName: 'books',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['isbn'],
        },
      ],
    }
  );

  return Book;
};







