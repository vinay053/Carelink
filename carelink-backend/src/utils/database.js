const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI;
    const uri = (rawUri && !rawUri.includes('your-connection-string'))
      ? rawUri
      : 'mongodb://localhost:27017/carelink';
    const conn = await mongoose.connect(uri);
    console.log(`[CareLink DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[CareLink DB] Database connection error: ${error.message}`);
    console.error(`Ensure local MongoDB container is running (docker compose up -d)`);
    throw error;
  }
};

module.exports = connectDB;
