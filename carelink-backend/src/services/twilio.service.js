let twilioClient = null;

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (accountSid && authToken && !twilioClient) {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
      console.log('[Twilio Service] Live Twilio client initialized.');
    } catch (err) {
      console.warn('[Twilio Service] Twilio SDK init warning:', err.message);
    }
  }
  return twilioClient;
}

/**
 * Send an SMS alert via Twilio or fallback to local terminal simulation
 */
async function sendSmsNotification({ toPhone, message }) {
  const client = getTwilioClient();
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  // Format phone number with +91 if Indian number without country code
  let formattedPhone = toPhone.trim();
  if (!formattedPhone.startsWith('+')) {
    if (formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`;
    } else {
      formattedPhone = `+${formattedPhone}`;
    }
  }

  // Live Twilio dispatch
  if (client && fromPhone) {
    try {
      console.log(`[Twilio Service] 🚀 Dispatching LIVE SMS to ${formattedPhone} from ${fromPhone}`);
      const response = await client.messages.create({
        body: message,
        from: fromPhone,
        to: formattedPhone
      });

      console.log(`[Twilio Service] ✓ SMS sent successfully! SID: ${response.sid}`);
      return {
        success: true,
        mode: 'live_twilio',
        sid: response.sid,
        status: response.status,
        to: formattedPhone
      };
    } catch (error) {
      console.error('[Twilio Service] ❌ Live SMS delivery failed:', error.message);
      return {
        success: false,
        mode: 'live_twilio_failed',
        error: error.message,
        fallback: 'Logged locally'
      };
    }
  }

  // Local simulated fallback
  console.log(`[CareLink SMS Dispatch] 📲 [SIMULATED LOCAL SMS]`);
  console.log(`  To: ${formattedPhone}`);
  console.log(`  Message: "${message}"`);
  console.log(`  Status: Delivered locally (Add TWILIO credentials in .env for live carrier SMS)`);

  return {
    success: true,
    mode: 'simulated_local',
    delivered: true,
    to: formattedPhone,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  sendSmsNotification
};
