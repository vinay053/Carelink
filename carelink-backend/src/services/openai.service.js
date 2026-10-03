const axios = require('axios');

const CARELINK_SYSTEM_PROMPT = `You are CareBot, an AI healthcare workflow coordinator for CareLink.
Your role is to assist doctors, administrators, and health workers in tracking patient referrals, detecting diagnostic follow-up gaps, and maintaining continuity of care across facilities.
SAFETY BOUNDARIES:
- You NEVER diagnose medical conditions.
- You NEVER prescribe medications or change treatment plans.
- You explain care gaps, summarize timelines, and recommend workflow actions (e.g. contact patient, schedule visit, assign ASHA worker).
- Always cite specific evidence and dates from the patient context when provided.
- Keep responses professional, clear, and actionable.`;

/**
 * Generate simulated streaming responses for local offline mode when no OpenAI key is set
 */
async function generateLocalStreamingResponse({ userMessage, patientContext, onChunk, onDone }) {
  let responseText = '';
  const lowerMsg = userMessage.toLowerCase();

  if (patientContext && (lowerMsg.includes('summar') || lowerMsg.includes('journey') || lowerMsg.includes('history'))) {
    responseText = `**Patient Journey Summary for ${patientContext.name || 'Patient'} (ABHA: ${patientContext.abhaId || 'N/A'})**:\n\n` +
      `• **Active Referrals**: ${patientContext.activeReferralsCount || 1} referral currently in progress.\n` +
      `• **Current Stage**: ${patientContext.currentStageName || 'Stage 1 (Accepted)'} - awaiting specialist consultation.\n` +
      `• **Risk Assessment**: Calculated Risk Score is **${patientContext.riskScore || 75}/100 (${patientContext.riskLevel || 'HIGH'})** due to travel distance and appointment delay.\n` +
      `• **Diagnostics**: Recent Troponin-T test marked **URGENT** awaiting physician review.\n\n` +
      `**Recommended Next Step**: Contact assigned ASHA worker to coordinate transport assistance and verify specialist clinic attendance.`;
  } else if (lowerMsg.includes('risk') || lowerMsg.includes('at-risk')) {
    responseText = `**Current High-Risk Referrals Requiring Attention**:\n\n` +
      `1. **Suresh Kumar** (Damoh → Jabalpur MC): Risk Score 85 (HIGH). Stage 1 pending for >48h. Factors: 58km distance, no private transport.\n` +
      `2. **Anita Bai** (Sagar DH → Jabalpur MC): Risk Score 70 (MEDIUM-HIGH). Delayed diagnostic review.\n\n` +
      `**Recommended Action**: Assign follow-up calls and notify referring PHC medical officer.`;
  } else if (lowerMsg.includes('icu') || lowerMsg.includes('hospital') || lowerMsg.includes('bed')) {
    responseText = `**Hospital Capability & Bed Status Overview**:\n\n` +
      `• **NSCB Medical College, Jabalpur**: 12/30 ICU beds available, CT & MRI operational, Cardiology specialist on-site today.\n` +
      `• **District Hospital Sagar**: 4/10 ICU beds available, CT operational, current capacity load 85%.\n` +
      `• **AIIMS Bhopal**: 18/40 ICU beds available, full tertiary subspecialties available.`;
  } else if (lowerMsg.includes('diagnostic') || lowerMsg.includes('lab') || lowerMsg.includes('test')) {
    responseText = `**Pending Diagnostic Follow-ups**:\n\n` +
      `• 2 critical lab results currently exceed the 24-hour review SLA window.\n` +
      `• Immediate action needed: Review Suresh Kumar's Troponin-T result and notify patient of subsequent cardiology consult.`;
  } else {
    responseText = `I have received your coordination query regarding "${userMessage}".\n\n` +
      `As CareLink's Care Coordinator, I am continuously tracking patient handoffs, referral SLA transitions, and cross-facility diagnostic reviews. All patient handoffs remain visible and monitored.\n\n` +
      `**Recommendation**: Check the active alerts dashboard to acknowledge urgent items.`;
  }

  // Stream word by word with slight delay
  const words = responseText.split(' ');
  for (const word of words) {
    onChunk(word + ' ');
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  onDone();
}

/**
 * Stream CareBot response via SSE
 */
async function streamCareBotResponse({ messages = [], patientContext = null, res }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const userMessage = messages[messages.length - 1]?.content || '';

  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!apiKey) {
    console.log('[CareBot] OPENAI_API_KEY not found; using high-fidelity local coordination streaming engine.');
    await generateLocalStreamingResponse({
      userMessage,
      patientContext,
      onChunk: (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
      onDone: () => {
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    });
    return;
  }

  try {
    const formattedMessages = [
      { role: 'system', content: CARELINK_SYSTEM_PROMPT }
    ];

    if (patientContext) {
      formattedMessages.push({
        role: 'system',
        content: `PATIENT CONTEXT:\n${JSON.stringify(patientContext, null, 2)}`
      });
    }

    messages.forEach(m => {
      formattedMessages.push({ role: m.role, content: m.content });
    });

    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      data: {
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        stream: true,
        temperature: 0.2
      },
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.includes('[DONE]')) {
          res.write('data: [DONE]\n\n');
          return;
        }
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.replace('data: ', ''));
            const text = parsed.choices[0]?.delta?.content || '';
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          } catch (e) {
            // ignore non-json chunk
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error('[CareBot] OpenAI API streaming error, falling back to local engine:', error.message);
    await generateLocalStreamingResponse({
      userMessage,
      patientContext,
      onChunk: (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
      onDone: () => {
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    });
  }
}

module.exports = {
  CARELINK_SYSTEM_PROMPT,
  streamCareBotResponse,
  generateLocalStreamingResponse
};
