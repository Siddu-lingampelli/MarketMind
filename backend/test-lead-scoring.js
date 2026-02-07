// Example: Testing Explainable AI Lead Scoring

const groqService = require('./services/groqService');

async function testLeadScoring() {
  console.log('🧪 Testing Explainable AI Lead Scoring\n');

  // Test Case 1: Hot Lead
  console.log('=== TEST 1: Hot Lead ===');
  const hotLead = await groqService.scoreLead(
    'Sarah Johnson',
    '$50,000 allocated budget',
    'Critical CRM implementation needed - current system causing revenue loss',
    'Immediate - must deploy by end of quarter',
    'VP of Sales with full decision authority'
  );
  console.log(JSON.stringify(hotLead, null, 2));
  console.log('\n');

  // Test Case 2: Warm Lead
  console.log('=== TEST 2: Warm Lead ===');
  const warmLead = await groqService.scoreLead(
    'Michael Chen',
    '$25,000 - needs final approval',
    'Looking for better analytics and reporting',
    'Planning for Q2 implementation',
    'Director of Marketing'
  );
  console.log(JSON.stringify(warmLead, null, 2));
  console.log('\n');

  // Test Case 3: Cold Lead
  console.log('=== TEST 3: Cold Lead ===');
  const coldLead = await groqService.scoreLead(
    'Tom Wilson',
    'Just exploring options',
    'Curious about CRM solutions',
    'No specific timeline',
    'Individual contributor'
  );
  console.log(JSON.stringify(coldLead, null, 2));
}

// Run test if executed directly
if (require.main === module) {
  testLeadScoring().catch(console.error);
}

module.exports = { testLeadScoring };
