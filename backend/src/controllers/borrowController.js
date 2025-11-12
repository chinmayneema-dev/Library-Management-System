const { Op } = require('sequelize');
const { BorrowRecord, Book, Member, sequelize } = require('../models');

const issueBook = async (req, res) => {
  const { bookId, memberId, issueDate, dueDate } = req.body;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status === 'ISSUED') {
      return res.status(400).json({ message: 'Book is already issued' });
    }

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Convert dates to YYYY-MM-DD format for DATEONLY fields
    const normalizedIssueDate = issueDate 
      ? new Date(issueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const normalizedDueDate = new Date(dueDate).toISOString().split('T')[0];

    // Use raw SQL insert to bypass Sequelize validation issues with field mapping
    await sequelize.query(
      `INSERT INTO borrow_records (book_id, member_id, issue_date, due_date, status, created_at, updated_at) 
       VALUES (:bookId, :memberId, :issueDate, :dueDate, 'ISSUED', NOW(), NOW())`,
      {
        replacements: {
          bookId: Number(bookId),
          memberId: Number(memberId),
          issueDate: normalizedIssueDate,
          dueDate: normalizedDueDate,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Fetch the most recently created record for this book/member combination
    const borrowRecord = await BorrowRecord.findOne({
      where: {
        bookId: Number(bookId),
        memberId: Number(memberId),
        status: 'ISSUED',
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' },
      ],
    });

    await book.update({ status: 'ISSUED' });

    return res.status(201).json(borrowRecord);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Issue book error:', error);
    return res.status(500).json({ message: 'Failed to issue book', error: error.message });
  }
};

const returnBook = async (req, res) => {
  const { borrowId, returnDate } = req.body;

  try {
    const borrowRecord = await BorrowRecord.findByPk(borrowId);
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrowRecord.status === 'RETURNED') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    const book = await Book.findByPk(borrowRecord.bookId);

    await borrowRecord.update({
      status: 'RETURNED',
      returnDate: returnDate || new Date(),
    });

    if (book) {
      await book.update({ status: 'AVAILABLE' });
    }

    return res.status(200).json(borrowRecord);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
};

const listBorrowRecords = async (req, res) => {
  const { status, memberId, activeOnly } = req.query;
  const where = {};

  try {
    if (req.user.role === 'MEMBER') {
      where.memberId = req.user.memberId;
    } else if (memberId) {
      where.memberId = memberId;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (activeOnly) {
      where.status = 'ISSUED';
      where.dueDate = { [Op.gte]: new Date() };
    }

    const records = await BorrowRecord.findAll({
      where,
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' },
      ],
      order: [['issueDate', 'DESC']],
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list borrow records', error: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  listBorrowRecords,
};

