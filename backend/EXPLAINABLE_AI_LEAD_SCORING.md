# Explainable AI Lead Scoring Feature

## Overview

The Explainable AI Lead Scoring system provides **transparent, trustworthy, and actionable** lead qualification scores with full breakdowns across 4 BANT dimensions.

---

## How It Works

### Input Parameters

```javascript
{
  name: "John Smith",
  budget: "$50,000 allocated for Q1",
  need: "Immediate CRM implementation needed",
  urgency: "High - must deploy by end of month",
  authority: "VP of Sales - final decision maker"
}
```

### Output Structure

```json
{
  "leadName": "John Smith",
  "leadScore": 88,
  "scoreBreakdown": {
    "budget": 22,
    "need": 24,
    "urgency": 21,
    "authority": 21
  },
  "reasoning": "This lead scored high because the budget is strong with clear funding allocated, the need is urgent and well-defined, timeline is immediate requiring action within weeks, and authority is confirmed with a VP-level decision maker. All BANT criteria are strongly met.",
  "conversionProbability": "75%",
  "priorityLevel": "Hot Lead",
  "recommendedAction": "Schedule a product demo within 24 hours. Prepare implementation timeline and ROI calculator for the meeting."
}
```

---

## Scoring Breakdown

### Budget Fit (0-25 points)

| Score Range | Description | Example |
|-------------|-------------|---------|
| **20-25** | Strong budget, clear funding ($50k+) | "$75,000 allocated in Q1 budget" |
| **15-19** | Moderate budget, likely approved ($20k-$50k) | "$30,000 available if ROI is proven" |
| **10-14** | Limited budget, needs approval ($5k-$20k) | "$10,000 but needs CFO sign-off" |
| **0-9** | No budget mentioned or very small (<$5k) | "Looking for free trial first" |

### Need Fit (0-25 points)

| Score Range | Description | Example |
|-------------|-------------|---------|
| **20-25** | Critical pain point, perfect solution fit | "Current system is costing us $50k/month in lost revenue" |
| **15-19** | Clear need, good alignment | "Need better reporting and analytics" |
| **10-14** | Moderate need, some fit | "Exploring options to improve efficiency" |
| **0-9** | Vague need or weak fit | "Just browsing, no specific problem yet" |

### Urgency Level (0-25 points)

| Score Range | Description | Example |
|-------------|-------------|---------|
| **20-25** | Immediate action needed (days/weeks) | "Must deploy before end of quarter" |
| **15-19** | Short-term timeline (1-3 months) | "Looking to implement in Q2" |
| **10-14** | Medium-term (3-6 months) | "Evaluating for next fiscal year" |
| **0-9** | Long-term or no timeline | "No rush, just researching options" |

### Authority Strength (0-25 points)

| Score Range | Description | Example |
|-------------|-------------|---------|
| **20-25** | C-level decision maker with budget authority | "CEO with full purchasing power" |
| **15-19** | Director/VP with strong influence | "VP of Sales, reports to CEO" |
| **10-14** | Manager with some influence | "Department Manager, needs VP approval" |
| **0-9** | Individual contributor or no authority | "Analyst gathering information" |

---

## Priority Levels

Based on total score (0-100):

- **Hot Lead (85-100)**: Immediate follow-up required within 24 hours
- **Warm Lead (70-84)**: High priority, contact within 48 hours
- **Lukewarm Lead (50-69)**: Moderate priority, nurture campaign
- **Cold Lead (0-49)**: Low priority, long-term nurture or disqualify

---

## Example Scenarios

### Scenario 1: Hot Lead (Score: 92)

**Input:**
```
Name: Sarah Johnson
Budget: $120,000 approved budget
Need: Critical - current system is causing major revenue loss
Urgency: Immediate - board meeting in 2 weeks
Authority: CFO with full authority
```

**Output:**
```json
{
  "leadName": "Sarah Johnson",
  "leadScore": 92,
  "scoreBreakdown": {
    "budget": 25,
    "need": 24,
    "urgency": 22,
    "authority": 21
  },
  "reasoning": "Exceptional lead with maximum budget score of 25/25 due to six-figure approved funding. Need is critical with quantifiable revenue impact (24/25). Urgency is maximum with board presentation deadline in 2 weeks (22/25). Authority is confirmed C-level with full purchasing power (21/25).",
  "conversionProbability": "85%",
  "priorityLevel": "Hot Lead",
  "recommendedAction": "Urgent: Contact immediately. Prepare executive presentation with ROI analysis, implementation timeline, and case studies for board meeting. Assign senior sales executive."
}
```

---

### Scenario 2: Warm Lead (Score: 76)

**Input:**
```
Name: Michael Chen
Budget: $40,000 - needs final approval
Need: Clear need for better analytics
Urgency: Looking to implement in Q2
Authority: Director of Marketing
```

**Output:**
```json
{
  "leadName": "Michael Chen",
  "leadScore": 76,
  "scoreBreakdown": {
    "budget": 18,
    "need": 20,
    "urgency": 19,
    "authority": 19
  },
  "reasoning": "Strong lead with good budget alignment at $40k range (18/25), pending final approval. Need is clear and well-articulated around analytics gaps (20/25). Timeline is reasonable for Q2 implementation (19/25). Director-level authority with likely approval path (19/25).",
  "conversionProbability": "65%",
  "priorityLevel": "Warm Lead",
  "recommendedAction": "Schedule discovery call within 48 hours. Focus on ROI justification to help secure final budget approval. Provide case studies from similar companies."
}
```

---

### Scenario 3: Lukewarm Lead (Score: 58)

**Input:**
```
Name: Lisa Martinez
Budget: $15,000 - budget is tight
Need: Exploring options to improve workflow
Urgency: No immediate timeline
Authority: Manager - needs VP approval
```

**Output:**
```json
{
  "leadName": "Lisa Martinez",
  "leadScore": 58,
  "scoreBreakdown": {
    "budget": 13,
    "need": 16,
    "urgency": 12,
    "authority": 17
  },
  "reasoning": "Moderate lead with limited budget of $15k requiring careful consideration (13/25). Need is present but not urgent or critical (16/25). No pressing timeline creates lower urgency score (12/25). Manager-level authority means additional approvals needed (17/25).",
  "conversionProbability": "35%",
  "priorityLevel": "Lukewarm Lead",
  "recommendedAction": "Add to nurture campaign. Send educational content and case studies. Follow up in 2-3 weeks. Focus on building relationship and understanding deeper needs."
}
```

---

### Scenario 4: Cold Lead (Score: 38)

**Input:**
```
Name: Tom Wilson
Budget: Just exploring options, no budget yet
Need: Curious about what's available
Urgency: Just researching
Authority: Individual contributor
```

**Output:**
```json
{
  "leadName": "Tom Wilson",
  "leadScore": 38,
  "scoreBreakdown": {
    "budget": 7,
    "need": 10,
    "urgency": 9,
    "authority": 12
  },
  "reasoning": "Low priority lead with no allocated budget (7/25). Need is vague and exploratory without clear pain point (10/25). No timeline or urgency indicated (9/25). Individual contributor with no purchasing authority (12/25). Requires significant nurturing before sales-ready.",
  "conversionProbability": "15%",
  "priorityLevel": "Cold Lead",
  "recommendedAction": "Add to long-term nurture email sequence. Provide educational resources. Do not prioritize for immediate sales outreach. Reassess in 3-6 months."
}
```

---

## API Usage

### Endpoint

```
POST /api/lead-scoring/analyze
```

### Request Body

```json
{
  "name": "Lead Name",
  "budget": "Budget details",
  "need": "Business need description",
  "urgency": "Timeline and urgency",
  "authority": "Decision-making authority"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "leadName": "...",
    "leadScore": 88,
    "scoreBreakdown": { ... },
    "reasoning": "...",
    "conversionProbability": "75%",
    "priorityLevel": "Hot Lead",
    "recommendedAction": "..."
  }
}
```

---

## Why This Approach Works

### 1. **Transparency**
Every score is backed by explicit reasoning across 4 measurable dimensions.

### 2. **Trust**
Sales teams can explain to stakeholders exactly why a lead scored high or low.

### 3. **Actionability**
Recommended actions are specific and tied to the score breakdown.

### 4. **Consistency**
Standardized scoring eliminates subjective bias in lead qualification.

### 5. **Education**
Teams learn what makes a "good lead" by studying the breakdown patterns.

---

## Best Practices

1. **Always capture all 4 BANT dimensions** during discovery
2. **Use specific details** rather than vague descriptions
3. **Update scores** as new information becomes available
4. **Train sales team** on how to interpret breakdowns
5. **Review patterns** monthly to refine qualification criteria

---

## Technical Implementation

The system uses:
- **Groq LLM (llama-3.3-70b-versatile)** for intelligent scoring
- **JSON response format** for structured, parseable output
- **Temperature 0.3** for consistent, reliable scoring
- **Explicit scoring rubric** embedded in prompt for transparency

---

**Built with Explainable AI principles for MarketMind**
