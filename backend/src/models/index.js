const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user');
const MemberModel = require('./member');
const BookModel = require('./book');
const BorrowRecordModel = require('./borrowRecord');

const User = UserModel(sequelize, Sequelize.DataTypes);
const Member = MemberModel(sequelize, Sequelize.DataTypes);
const Book = BookModel(sequelize, Sequelize.DataTypes);
const BorrowRecord = BorrowRecordModel(sequelize, Sequelize.DataTypes);

Member.hasOne(User, {
  foreignKey: {
    name: 'member_id',
    allowNull: true,
  },
  as: 'userAccount',
});

User.belongsTo(Member, {
  foreignKey: {
    name: 'member_id',
    allowNull: true,
  },
  as: 'memberProfile',
});

Member.hasMany(BorrowRecord, {
  foreignKey: {
    name: 'member_id',
    allowNull: false,
  },
  as: 'borrowRecords',
});

BorrowRecord.belongsTo(Member, {
  foreignKey: {
    name: 'member_id',
    allowNull: false,
  },
  as: 'member',
});

Book.hasMany(BorrowRecord, {
  foreignKey: {
    name: 'book_id',
    allowNull: false,
  },
  as: 'borrowRecords',
});

BorrowRecord.belongsTo(Book, {
  foreignKey: {
    name: 'book_id',
    allowNull: false,
  },
  as: 'book',
});

const db = {
  sequelize,
  Sequelize,
  User,
  Member,
  Book,
  BorrowRecord,
};

module.exports = db;

