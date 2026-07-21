const API = '/api/groq';

export function hasApiKey() { return true; }
export function setApiKey() {}
export function clearApiKey() {}

async function groqChat(messages, options = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'llama-3.3-70b-versatile',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens || 2000,
      response_format: options.responseFormat || { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function safeJsonParse(raw) {
  try {
    let s = raw.trim();
    if (s.startsWith('```json')) s = s.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    else if (s.startsWith('```')) s = s.replace(/```\n?/g, '');
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function cap(s, max = 1500) { return (typeof s === 'string' ? s.slice(0, max) : String(s || '')); }

export async function generateCampaign(product, audience, platform, campaignObjective = 'lead-generation', tone = 'professional') {
  const prompt = `You are an expert marketing strategist. Generate a campaign for:
Product: ${cap(product)}
Audience: ${cap(audience)}
Platform: ${cap(platform)}
Objective: ${campaignObjective}
Tone: ${tone}

Return ONLY valid JSON:
{
  "objective": "...",
  "content_ideas": ["idea1","idea2","idea3","idea4","idea5"],
  "ad_copies": ["copy1","copy2","copy3"],
  "ctas": ["cta1","cta2","cta3"]
}`;

  const raw = await groqChat([
    { role: 'system', content: 'You are an expert marketing strategist. Always return valid JSON.' },
    { role: 'user', content: prompt },
  ], { maxTokens: 2000 });

  const data = safeJsonParse(raw);
  return {
    objective: data?.objective || 'Campaign generated',
    contentIdeas: data?.content_ideas || [],
    adCopies: data?.ad_copies || [],
    ctas: data?.ctas || [],
  };
}

export async function generatePitch(productName, persona, industry, companySize = '', budgetRange = '', pitchMode = 'elevator') {
  const prompt = `Generate a ${pitchMode} sales pitch for:
Product: ${cap(productName, 200)}
Persona: ${cap(persona)}
Industry: ${cap(industry, 200)}
Company Size: ${cap(companySize, 50) || 'N/A'}
Budget: ${cap(budgetRange, 50) || 'N/A'}

Return ONLY valid JSON:
{
  "elevator_pitch": "2-3 sentence pitch",
  "value_proposition": "unique value",
  "differentiators": ["diff1","diff2","diff3"],
  "call_to_action": "next step"
}`;

  const raw = await groqChat([
    { role: 'system', content: 'You are an expert sales professional. Always return valid JSON.' },
    { role: 'user', content: prompt },
  ], { maxTokens: 2000 });

  const data = safeJsonParse(raw);
  return {
    elevatorPitch: data?.elevator_pitch || '',
    valueProposition: data?.value_proposition || '',
    differentiators: data?.differentiators || [],
    callToAction: data?.call_to_action || '',
  };
}

export async function scoreLead(name, budget, need, urgency, authority, emailContext) {
  const ctx = emailContext ? `\nEmail Context:\n${cap(emailContext, 2000)}` : '';

  const prompt = `Score this lead (0-100):
Name: ${cap(name, 200)}
Budget: ${cap(budget, 500)}
Need: ${cap(need, 500)}
Urgency: ${cap(urgency, 200)}
Authority: ${cap(authority, 500)}${ctx}

Return ONLY valid JSON:
{
  "lead_score": 0-100,
  "priority_level": "Hot/Warm/Lukewarm/Cold",
  "conversion_probability": "0-100%",
  "reasoning": "brief explanation",
  "recommended_action": "next step",
  "next_actions": [{"action":"...","priority":"High/Medium/Low","timeline":"..."}]
}`;

  const raw = await groqChat([
    { role: 'system', content: 'You are an expert sales analyst. Always return valid JSON.' },
    { role: 'user', content: prompt },
  ], { temperature: 0.3, maxTokens: 1200 });

  const data = safeJsonParse(raw);
  return {
    score: data?.lead_score ?? 50,
    category: data?.priority_level || 'Lukewarm',
    conversionProbability: parseInt(data?.conversion_probability) || 50,
    explanation: data?.reasoning || 'Analysis complete.',
    nextAction: data?.recommended_action || 'Follow up',
    nextActions: data?.next_actions || [],
  };
}
