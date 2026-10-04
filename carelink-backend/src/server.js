const app = require('./app');
const http = require('http');
const connectDB = require('./utils/database');
const { initCareGapCron } = require('./services/careGap.service');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start background care-gap auditor cron
    initCareGapCron();

    // Start HTTP server
    const server = http.createServer(app);

    server.listen(PORT, HOST, () => {
      console.log(`[CareLink Backend] Server listening on http://${HOST}:${PORT}`);
      console.log(`[CareLink Backend] Health check available at http://${HOST}:${PORT}/health`);
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
