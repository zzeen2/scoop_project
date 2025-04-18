const db = require('./configs');

async function initDatabase() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await db.sequelize.close();
    console.log('Database connection closed');
  }
}

initDatabase();