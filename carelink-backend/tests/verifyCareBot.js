const assert = require('assert');
const { CARELINK_SYSTEM_PROMPT, generateLocalStreamingResponse } = require('../src/services/openai.service');

async function runCareBotVerification() {
  console.log('--- [CareLink] Verifying CareBot AI Coordinator ---');

  // 1. Check safety guardrails in system prompt
  console.log('Checking safety boundaries in system prompt...');
  assert(CARELINK_SYSTEM_PROMPT.includes('NEVER diagnose'), 'Must forbid clinical diagnosis');
  assert(CARELINK_SYSTEM_PROMPT.includes('NEVER prescribe'), 'Must forbid medication prescription');
  assert(CARELINK_SYSTEM_PROMPT.includes('coordinat'), 'Must emphasize care coordination');
  console.log('✓ Safety guardrails verified in system prompt');

  // 2. Test local streaming engine with patient context
  console.log('Testing local streaming generation with patient context...');
  const chunks = [];
  let doneCalled = false;

  await generateLocalStreamingResponse({
    userMessage: 'Can you summarize this patient journey and referral status?',
    patientContext: {
      name: 'Suresh Kumar',
      abhaId: '23-4567-8901-2345',
      activeReferralsCount: 1,
      currentStageName: 'Stage 1 (Accepted)',
      riskScore: 85,
      riskLevel: 'HIGH'
    },
    onChunk: (chunk) => {
      chunks.push(chunk);
    },
    onDone: () => {
      doneCalled = true;
    }
  });

  const fullText = chunks.join('');
  assert(doneCalled, 'onDone callback must be triggered');
  assert(chunks.length > 5, 'Should generate multiple streaming token chunks');
  assert(fullText.includes('Suresh Kumar'), 'Response must incorporate patient name from context');
  assert(fullText.includes('85'), 'Response must cite risk score from context');
  assert(!fullText.includes('diagnose you with'), 'Response must not offer clinical diagnosis');

  console.log(`✓ Streamed ${chunks.length} chunks successfully: "${fullText.substring(0, 70)}..."`);

  console.log('\n>>> CAREBOT AI COORDINATOR VERIFIED SUCCESSFULLY <<<');
  process.exit(0);
}

runCareBotVerification();
