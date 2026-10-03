const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');
    console.log(`[CareLink DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[CareLink DB] Database connection error: ${error.message}`);
    console.error(`Ensure local MongoDB container is running (docker compose up -d)`);
    throw error;
  }
};

module.exports = connectDB;
