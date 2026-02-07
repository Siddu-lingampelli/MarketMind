# Explainable AI Lead Scoring - Groq Prompt Template

## The Prompt That Powers Transparent Lead Scoring

This is the exact prompt template used to generate explainable, trustworthy lead scores with full breakdowns.

---

## Complete Prompt Template

```
You are an expert sales analyst specializing in EXPLAINABLE lead qualification.

Analyze this lead with TRANSPARENT scoring:

Lead Name: ${name}
Budget Details: ${budget}
Business Need: ${need}
Urgency Level: ${urgency}
Authority: ${authority}

CRITICAL: You must provide EXACT numerical scores for each dimension that add up to the total.

Evaluate across these 4 dimensions (each worth 0-25 points):

1. BUDGET FIT (0-25 points)
   - 20-25: Strong budget, clear funding ($50k+)
   - 15-19: Moderate budget, likely approved ($20k-$50k)
   - 10-14: Limited budget, needs approval ($5k-$20k)
   - 0-9: No budget mentioned or very small (<$5k)

2. NEED FIT (0-25 points)
   - 20-25: Critical pain point, perfect solution fit
   - 15-19: Clear need, good alignment
   - 10-14: Moderate need, some fit
   - 0-9: Vague need or weak fit

3. URGENCY LEVEL (0-25 points)
   - 20-25: Immediate action needed (days/weeks)
   - 15-19: Short-term timeline (1-3 months)
   - 10-14: Medium-term (3-6 months)
   - 0-9: Long-term or no timeline

4. AUTHORITY STRENGTH (0-25 points)
   - 20-25: C-level decision maker with budget authority
   - 15-19: Director/VP with strong influence
   - 10-14: Manager with some influence
   - 0-9: Individual contributor or no authority mentioned

YOU MUST RESPOND IN THIS EXACT JSON FORMAT (no other text):
{
  "lead_name": "${name}",
  "lead_score": [SUM OF ALL 4 SCORES],
  "score_breakdown": {
    "budget": [0-25],
    "need": [0-25],
    "urgency": [0-25],
    "authority": [0-25]
  },
  "reasoning": "[2-3 sentences explaining why each score was given in simple business language]",
  "conversion_probability": "[percentage based on total score]",
  "priority_level": "[Hot Lead (85-100) / Warm Lead (70-84) / Lukewarm Lead (50-69) / Cold Lead (0-49)]",
  "recommended_action": "[Specific next step based on score and breakdown]"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text.
```

---

## System Message

```
You are an expert sales analyst specializing in explainable AI and transparent lead scoring. 
You ALWAYS return valid JSON responses with detailed breakdowns.
```

---

## API Configuration

```javascript
{
  model: 'llama-3.3-70b-versatile',
  temperature: 0.3,              // Low for consistent scoring
  max_tokens: 1200,              // Enough for detailed reasoning
  response_format: { type: 'json_object' }  // Forces JSON output
}
```

---

## Why This Prompt Works

### 1. **Explicit Scoring Rubric**
Each dimension has clear 0-25 point ranges with specific criteria, eliminating ambiguity.

### 2. **Forces Transparency**
The prompt demands exact numerical scores that must add up to the total, ensuring accountability.

### 3. **Business Language**
Asks for "simple business language" reasoning, not vague AI jargon.

### 4. **Structured JSON**
Enforces consistent output format that's easy to parse and display in UI.

### 5. **Action-Oriented**
Requires specific recommended actions based on the scoring breakdown.

---

## Sample Input → Output

### Input Variables
```javascript
name: "John Smith"
budget: "$50,000 allocated for Q1"
need: "Immediate CRM implementation"
urgency: "High - must deploy by end of month"
authority: "VP of Sales - final decision maker"
```

### Expected Output
```json
{
  "lead_name": "John Smith",
  "lead_score": 88,
  "score_breakdown": {
    "budget": 22,
    "need": 24,
    "urgency": 21,
    "authority": 21
  },
  "reasoning": "This lead scored 88/100 with strong performance across all BANT criteria. Budget is solid at $50k with clear allocation (22/25). Need is urgent and critical with immediate CRM requirement (24/25). Timeline is aggressive requiring deployment within weeks (21/25). Authority is confirmed VP-level with final decision power (21/25).",
  "conversion_probability": "75%",
  "priority_level": "Hot Lead",
  "recommended_action": "Schedule product demo within 24 hours. Prepare implementation timeline and ROI calculator. Assign senior sales executive to handle this opportunity."
}
```

---

## Key Design Decisions

### Temperature: 0.3 (Low)
- Ensures **consistent scoring** across similar leads
- Reduces randomness in numerical assignments
- More reliable for business-critical decisions

### Max Tokens: 1200
- Allows for **detailed reasoning** without cutting off
- Supports comprehensive recommended actions
- Enough space for edge cases and nuanced explanations

### JSON Response Format
- **Guarantees parseable output**
- No markdown code blocks to strip
- Direct integration with frontend UI

### Explicit Constraints
- "MUST respond in EXACT JSON format"
- "Return ONLY valid JSON, no markdown"
- Forces compliance even with creative models

---

## Prompt Engineering Techniques Used

1. **Role Assignment**: "You are an expert sales analyst specializing in EXPLAINABLE lead qualification"
2. **Output Constraints**: Exact JSON structure specified
3. **Scoring Rubric**: Detailed 0-25 point ranges for each dimension
4. **Context Injection**: All lead data interpolated into prompt
5. **Validation Rules**: "CRITICAL: scores must add up to total"
6. **Tone Guidance**: "simple business language" not jargon
7. **Action Requirement**: Forces specific next steps, not generic advice

---

## Extending the Prompt

To add more dimensions:

```javascript
5. TIMING FIT (0-25 points)
   - 20-25: Perfect timing for seasonal/market factors
   - 15-19: Good timing, aligns with business cycles
   - 10-14: Neutral timing
   - 0-9: Poor timing (budget freeze, off-season)
```

Update JSON structure:
```json
{
  "score_breakdown": {
    "budget": [0-25],
    "need": [0-25],
    "urgency": [0-25],
    "authority": [0-25],
    "timing": [0-25]  // New dimension
  }
}
```

Adjust total score to 0-125 or normalize back to 0-100.

---

## Testing Recommendations

1. **Test with edge cases**: No budget, no authority, vague needs
2. **Verify JSON parsing**: Handle markdown code blocks
3. **Check score consistency**: Same input should yield similar scores
4. **Validate math**: Breakdown should always sum to total score
5. **Review reasoning quality**: Must be business-friendly and specific

---

**This prompt is optimized for Groq's LLaMA 3.3 70B model but works with other LLMs.**
