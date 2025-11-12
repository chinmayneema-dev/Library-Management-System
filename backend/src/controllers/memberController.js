const bcrypt = require('bcrypt');
const { Member, User, BorrowRecord, Book } = require('../models');

const addMember = async (req, res) => {
  const { name, email, phone, address, membershipDate, password } = req.body;

  try {
    const member = await Member.create({
      name,
      email,
      phone,
      address,
      membershipDate,
    });

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({
        username: email,
        passwordHash,
        role: 'MEMBER',
        memberId: member.memberId,
      });
    }

    return res.status(201).json(member);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
};

const listMembers = async (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * limit;
  try {
    if (req.user.role !== 'LIBRARIAN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows, count } = await Member.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list members', error: error.message });
  }
};

const getMember = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === 'MEMBER' && Number(req.user.memberId) !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    return res.status(200).json(member);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch member', error: error.message });
  }
};

const getMemberBorrowHistory = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === 'MEMBER' && Number(req.user.memberId) !== Number(id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const history = await BorrowRecord.findAll({
      where: { memberId: id },
      include: [
        {
          model: Book,
          as: 'book',
        },
      ],
      order: [['issueDate', 'DESC']],
    });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

module.exports = {
  addMember,
  listMembers,
  getMember,
  getMemberBorrowHistory,
};

