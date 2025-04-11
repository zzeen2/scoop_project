// initdb.js
const db = require('./configs');

async function initDatabase() {
  try {
    // 데이터베이스 동기화
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // 연결 종료
    await db.sequelize.close();
    console.log('Database connection closed');
  }
}

initDatabase();