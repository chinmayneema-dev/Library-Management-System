const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');
const { ensureAdminUser, ensureSampleBooks } = require('./services/seedService');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureAdminUser();
    await ensureSampleBooks();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();


