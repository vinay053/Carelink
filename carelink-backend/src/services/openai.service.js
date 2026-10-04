// Re-export from Gemini service to maintain full backwards-compatibility
const geminiService = require('./gemini.service');

module.exports = {
  ...geminiService
};
