const bcrypt = require('bcrypt');
const { User, Book } = require('../models');

const ensureAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ where: { role: 'LIBRARIAN', username } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      username,
      passwordHash,
      role: 'LIBRARIAN',
    });
  }
};

const ensureSampleBooks = async () => {
  const existingCount = await Book.count();
  if (existingCount > 0) {
    return;
  }

  const books = [
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software', publisher: 'Addison-Wesley', isbn: '9780201616224', status: 'AVAILABLE' },
    { title: 'Clean Code', author: 'Robert C. Martin', category: 'Software', publisher: 'Prentice Hall', isbn: '9780132350884', status: 'AVAILABLE' },
    { title: 'Design Patterns', author: 'Erich Gamma', category: 'Software', publisher: 'Addison-Wesley', isbn: '9780201633610', status: 'AVAILABLE' },
    { title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Algorithms', publisher: 'MIT Press', isbn: '9780262033848', status: 'AVAILABLE' },
    { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', category: 'Software', publisher: 'Addison-Wesley', isbn: '9780201835953', status: 'AVAILABLE' },
    { title: 'Refactoring', author: 'Martin Fowler', category: 'Software', publisher: 'Addison-Wesley', isbn: '9780201485677', status: 'AVAILABLE' },
    { title: 'You Don’t Know JS Yet', author: 'Kyle Simpson', category: 'JavaScript', publisher: 'Independently Published', isbn: '9781091210099', status: 'AVAILABLE' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'JavaScript', publisher: 'No Starch Press', isbn: '9781593279509', status: 'AVAILABLE' },
    { title: 'Python Crash Course', author: 'Eric Matthes', category: 'Python', publisher: 'No Starch Press', isbn: '9781593276034', status: 'AVAILABLE' },
    { title: 'Fluent Python', author: 'Luciano Ramalho', category: 'Python', publisher: 'O’Reilly', isbn: '9781491946008', status: 'AVAILABLE' },
    { title: 'Deep Learning', author: 'Goodfellow, Bengio, Courville', category: 'AI', publisher: 'MIT Press', isbn: '9780262035613', status: 'AVAILABLE' },
    { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', category: 'AI', publisher: 'O’Reilly', isbn: '9781492032649', status: 'AVAILABLE' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', publisher: 'Harper', isbn: '9780062316110', status: 'AVAILABLE' },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-help', publisher: 'Avery', isbn: '9780735211292', status: 'AVAILABLE' },
    { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', publisher: 'HarperOne', isbn: '9780061122415', status: 'AVAILABLE' },
    { title: '1984', author: 'George Orwell', category: 'Fiction', publisher: 'Signet', isbn: '9780451524935', status: 'AVAILABLE' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', publisher: 'Harper Perennial', isbn: '9780061120084', status: 'AVAILABLE' },
    { title: 'The Lean Startup', author: 'Eric Ries', category: 'Business', publisher: 'Crown Business', isbn: '9780307887894', status: 'AVAILABLE' },
    { title: 'Zero to One', author: 'Peter Thiel', category: 'Business', publisher: 'Crown Business', isbn: '9780804139298', status: 'AVAILABLE' },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psychology', publisher: 'Farrar, Straus and Giroux', isbn: '9780374533557', status: 'AVAILABLE' },
  ];

  await Book.bulkCreate(books);
};

module.exports = {
  ensureAdminUser,
  ensureSampleBooks,
};


