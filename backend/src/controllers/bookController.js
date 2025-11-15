const { Op } = require('sequelize');
const { Book } = require('../models');

const addBook = async (req, res) => {
  const { title, author, category, publisher, isbn, status } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      category,
      publisher,
      isbn,
      status: status ? status.toUpperCase() : undefined,
    });
    return res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.errors?.find(e => e.path === 'isbn')) {
        return res.status(400).json({ message: 'ISBN already exists. Please use a different ISBN.' });
      }
    }
    return res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  if (payload.status) {
    payload.status = payload.status.toUpperCase();
  }

  try {
    const [updatedRows, [updatedBook]] = await Book.update(payload, {
      where: { bookId: id },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(updatedBook);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.errors?.find(e => e.path === 'isbn')) {
        return res.status(400).json({ message: 'ISBN already exists. Please use a different ISBN.' });
      }
    }
    return res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await Book.destroy({ where: { bookId: id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

const listBooks = async (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * limit;

  try {
    const { rows, count } = await Book.findAndCountAll({
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
    return res.status(500).json({ message: 'Failed to list books', error: error.message });
  }
};

const searchBooks = async (req, res) => {
  const { title, author, category } = req.query;
  const whereConditions = [];

  if (title) {
    whereConditions.push({ title: { [Op.like]: `%${title}%` } });
  }
  if (author) {
    whereConditions.push({ author: { [Op.like]: `%${author}%` } });
  }
  if (category) {
    whereConditions.push({ category: { [Op.like]: `%${category}%` } });
  }

  try {
    const books = await Book.findAll({
      where: whereConditions.length ? { [Op.and]: whereConditions } : undefined,
      order: [['title', 'ASC']],
    });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  listBooks,
  searchBooks,
};







