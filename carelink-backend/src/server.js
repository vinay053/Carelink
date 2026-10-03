const app = require('./app');
const http = require('http');
const connectDB = require('./utils/database');
const { initCareGapCron } = require('./services/careGap.service');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start background care-gap auditor cron
    initCareGapCron();

    // Start HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`[CareLink Backend] Server listening on http://localhost:${PORT}`);
      console.log(`[CareLink Backend] Health check available at http://localhost:${PORT}/health`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
