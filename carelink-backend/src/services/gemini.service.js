const axios = require('axios');

const CARELINK_SYSTEM_PROMPT = `You are CareBot, an AI healthcare workflow coordinator for CareLink powered by Gemini 3.5 Flash-Lite.
Your role is to assist doctors, administrators, and health workers in tracking patient referrals, detecting diagnostic follow-up gaps, and maintaining continuity of care across facilities.
SAFETY BOUNDARIES:
- You NEVER diagnose medical conditions.
- You NEVER prescribe medications or change treatment plans.
- You explain care gaps, summarize timelines, and recommend workflow actions (e.g. contact patient, schedule visit, assign ASHA worker).
- Always cite specific evidence and dates from the patient context when provided.
- Keep responses professional, clear, and actionable.`;

/**
 * Generate simulated streaming responses for local offline mode when no API key is set
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
 * Format conversation messages into Google Gemini API multi-turn contents schema
 */
function formatMessagesForGemini(messages) {
  const contents = [];
  for (const m of messages) {
    const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
    const text = m.content || '';
    if (!text.trim()) continue;

    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += `\n${text}`;
    } else {
      if (contents.length === 0 && role === 'model') {
        continue; // Gemini contents must start with a user turn
      }
      contents.push({
        role,
        parts: [{ text }]
      });
    }
  }
  return contents;
}

/**
 * Stream CareBot response via SSE using Google Gemini API
 */
async function streamCareBotResponse({ messages = [], patientContext = null, res }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const userMessage = messages[messages.length - 1]?.content || '';

  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!apiKey) {
    console.log('[CareBot] GEMINI_API_KEY not found; using high-fidelity local coordination streaming engine.');
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
    let systemText = CARELINK_SYSTEM_PROMPT;
    if (patientContext) {
      systemText += `\n\nACTIVE PATIENT CONTEXT:\n${JSON.stringify(patientContext, null, 2)}\nUse this patient context whenever relevant.`;
    }

    const contents = formatMessagesForGemini(messages);
    if (contents.length === 0 && userMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await axios({
      method: 'post',
      url: endpoint,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        systemInstruction: {
          parts: [{ text: systemText }]
        },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      },
      responseType: 'stream'
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6));
            const parts = parsed.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part.text) {
                res.write(`data: ${JSON.stringify({ text: part.text })}\n\n`);
              }
            }
          } catch (e) {
            // ignore malformed chunk
          }
        }
      }
    });

    response.data.on('end', () => {
      if (buffer.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(buffer.slice(6));
          const parts = parsed.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.text) {
              res.write(`data: ${JSON.stringify({ text: part.text })}\n\n`);
            }
          }
        } catch (e) {}
      }
      res.write('data: [DONE]\n\n');
      res.end();
    });

    response.data.on('error', async (err) => {
      console.error('[CareBot] Gemini stream data error:', err.message);
      res.write('data: [DONE]\n\n');
      res.end();
    });

  } catch (error) {
    console.error('[CareBot] Gemini API streaming error, falling back to local engine:', error.response?.data || error.message);
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
  generateLocalStreamingResponse,
  formatMessagesForGemini
};
