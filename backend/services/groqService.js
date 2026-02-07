const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.model = 'llama-3.3-70b-versatile';
  }

  async generateCampaign(product, audience, platform, campaignObjective = 'lead-generation', tone = 'professional') {
    // Define objective-specific guidance
    const objectiveConfig = {
      'brand-awareness': {
        focus: 'Reach and impressions',
        metrics: 'Focus on reach, impressions, brand recall',
        cta_style: 'Soft CTAs like Learn More, Discover, Explore',
      },
      'lead-generation': {
        focus: 'Lead capture and qualification',
        metrics: 'Focus on conversion rate, lead quality, cost per lead',
        cta_style: 'Direct CTAs like Sign Up, Get Started, Download',
      },
      'product-launch': {
        focus: 'Excitement and early adoption',
        metrics: 'Focus on early signups, waitlist, pre-orders',
        cta_style: 'Urgency CTAs like Be First, Limited Access, Early Bird',
      },
      'conversions': {
        focus: 'Direct sales and transactions',
        metrics: 'Focus on conversion rate, ROAS, revenue',
        cta_style: 'Action CTAs like Buy Now, Get Offer, Purchase',
      },
      'retargeting': {
        focus: 'Re-engagement and conversion',
        metrics: 'Focus on return rate, recovery rate, lifetime value',
        cta_style: 'Reminder CTAs like Come Back, Complete Purchase, Continue',
      },
    };

    // Define tone-specific guidance
    const toneConfig = {
      'professional': 'Formal, authoritative, data-driven language',
      'conversational': 'Friendly, relatable, casual but respectful',
      'bold': 'Strong, confident, provocative statements',
      'educational': 'Informative, helpful, teaching-focused',
    };

    const objConfig = objectiveConfig[campaignObjective] || objectiveConfig['lead-generation'];
    const toneStyle = toneConfig[tone] || toneConfig['professional'];
    
    const prompt = `You are an expert marketing strategist with deep analytics experience. Generate a comprehensive marketing campaign with performance predictions for:

Product/Service: ${product}
Target Audience: ${audience}
Platform: ${platform}

CAMPAIGN OBJECTIVE: ${campaignObjective.toUpperCase().replace('-', ' ')}
${objConfig.focus}
${objConfig.metrics}
CTA Style: ${objConfig.cta_style}

TONE: ${tone.toUpperCase()}
${toneStyle}

CRITICAL: Return ONLY valid JSON, no markdown, no extra text.

{
  "objective": "One clear campaign objective sentence",
  "content_ideas": ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"],
  "ad_copies": ["Copy 1", "Copy 2", "Copy 3"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3"],
  "performance_prediction": {
    "ctr": {
      "min": 2.5,
      "max": 3.8,
      "unit": "%"
    },
    "engagement_rate": {
      "min": 4.2,
      "max": 6.5,
      "unit": "%"
    },
    "estimated_reach": {
      "min": 5000,
      "max": 12000,
      "unit": "impressions"
    },
    "confidence_level": "High",
    "key_factors": ["Factor 1", "Factor 2", "Factor 3"]
  }
}

Base predictions on:
- Platform: ${platform} (LinkedIn typically 2-6% CTR, Facebook 1-3%, Instagram 1.5-4%, Twitter 1-3%)
- Audience specificity
- Product-market fit
- Content quality indicators

Provide realistic, data-driven predictions with confidence level (High/Medium/Low).`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing strategist specializing in data-driven campaign planning with performance analytics. You ALWAYS return valid JSON responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseCampaignWithPrediction(response);
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to generate campaign');
    }
  }

  parseCampaignWithPrediction(response) {
    try {
      // Remove any markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      const data = JSON.parse(cleanResponse);
      
      return {
        objective: data.objective || 'Drive engagement and conversions',
        contentIdeas: data.content_ideas || ['Content idea 1', 'Content idea 2', 'Content idea 3', 'Content idea 4', 'Content idea 5'],
        adCopies: data.ad_copies || ['Ad copy 1', 'Ad copy 2', 'Ad copy 3'],
        ctas: data.ctas || ['Learn More', 'Get Started', 'Sign Up Now'],
        performancePrediction: {
          ctr: data.performance_prediction?.ctr || { min: 2.0, max: 4.0, unit: '%' },
          engagementRate: data.performance_prediction?.engagement_rate || { min: 3.0, max: 5.0, unit: '%' },
          estimatedReach: data.performance_prediction?.estimated_reach || { min: 3000, max: 8000, unit: 'impressions' },
          confidenceLevel: data.performance_prediction?.confidence_level || 'Medium',
          keyFactors: data.performance_prediction?.key_factors || ['Target audience alignment', 'Platform fit', 'Content quality']
        },
        rawResponse: response,
      };
    } catch (error) {
      console.error('Failed to parse campaign JSON:', error);
      // Fallback to old parser
      return this.parseCampaignResponse(response);
    }
  }

  parseCampaignResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());
    
    let objective = '';
    const contentIdeas = [];
    const adCopies = [];
    const ctas = [];
    
    let currentSection = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('objective')) {
        currentSection = 'objective';
        continue;
      } else if (lowerLine.includes('content idea')) {
        currentSection = 'contentIdeas';
        continue;
      } else if (lowerLine.includes('ad copy')) {
        currentSection = 'adCopies';
        continue;
      } else if (lowerLine.includes('cta') || lowerLine.includes('call-to-action')) {
        currentSection = 'ctas';
        continue;
      }
      
      const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
      
      if (cleanLine) {
        if (currentSection === 'objective' && !objective) {
          objective = cleanLine;
        } else if (currentSection === 'contentIdeas' && contentIdeas.length < 5) {
          contentIdeas.push(cleanLine);
        } else if (currentSection === 'adCopies' && adCopies.length < 3) {
          adCopies.push(cleanLine);
        } else if (currentSection === 'ctas' && ctas.length < 3) {
          ctas.push(cleanLine);
        }
      }
    }
    
    return {
      objective: objective || 'Drive engagement and conversions through targeted content',
      contentIdeas: contentIdeas.length > 0 ? contentIdeas : ['Content idea 1', 'Content idea 2', 'Content idea 3', 'Content idea 4', 'Content idea 5'],
      adCopies: adCopies.length > 0 ? adCopies : ['Ad copy 1', 'Ad copy 2', 'Ad copy 3'],
      ctas: ctas.length > 0 ? ctas : ['Learn More', 'Get Started', 'Sign Up Now'],
      rawResponse: response,
    };
  }

  async generatePitch(productName, persona, industry, companySize, budgetRange, pitchMode = 'elevator') {
    // Define tone and format based on pitch mode
    const modeConfig = {
      elevator: {
        tone: 'concise and impactful',
        length: '30-second pitch',
        style: 'Quick hook, core value, memorable close',
      },
      email: {
        tone: 'professional and detailed',
        length: 'full email format',
        style: 'Subject line focus, structured body, clear CTA',
      },
      linkedin: {
        tone: 'conversational and professional',
        length: 'LinkedIn DM style',
        style: 'Casual opener, value-focused, connection-building',
      },
      executive: {
        tone: 'strategic and high-level',
        length: 'executive summary style',
        style: 'Business impact, ROI focus, C-suite language',
      },
      cold_email: {
        tone: 'personalized and value-focused',
        length: 'cold email outreach',
        style: 'Personalized opening, problem-solution, soft CTA',
      },
    };

    const config = modeConfig[pitchMode] || modeConfig.elevator;
    
    // Special handling for cold email outreach
    if (pitchMode === 'cold_email') {
      const coldEmailPrompt = `You are an expert B2B sales copywriter specializing in cold email outreach.

Generate a personalized, high-converting cold email using the details below.

Product/Service: ${productName}
Target Customer Persona: ${persona}
Industry: ${industry}
Company Size: ${companySize || 'Not specified'}
Budget Range: ${budgetRange || 'Not specified'}

CRITICAL RULES:
- Keep it concise and professional (100-150 words)
- NO spammy language or hype
- Personalize the opening based on persona
- Focus on VALUE and OUTCOMES, not features
- Soft CTA (meeting/demo suggestion)
- Sound like a human, NOT marketing copy
- Address a specific pain point

CRITICAL: Return ONLY valid JSON, no markdown, no extra text.

{
  "subject_line": "Short, personalized subject (max 7 words)",
  "email_body": "Hi {{FirstName}},\\n\\n[Personalized opening based on their role/industry]\\n\\n[Identify specific pain point]\\n\\n[How your product solves it - focus on outcome]\\n\\n[Soft CTA]",
  "cta": "Would you be open to a 15-minute call next week?",
  "personalization_tips": ["Replace {{FirstName}} with prospect's name", "Tip 2", "Tip 3"]
}`;

      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert B2B sales copywriter. You write personalized, non-spammy cold emails that convert. You ALWAYS return valid JSON responses.',
            },
            {
              role: 'user',
              content: coldEmailPrompt,
            },
          ],
          model: this.model,
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        });

        const response = completion.choices[0]?.message?.content || '';
        return this.parseColdEmailResponse(response);
      } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to generate cold email');
      }
    }

    // Special handling for follow-up email
    if (pitchMode === 'follow_up') {
      const followUpPrompt = `You are an expert B2B sales copywriter specializing in follow-up emails.

Generate a polite, non-pushy follow-up email assuming the recipient did not reply to your initial outreach 4 days ago.

Product/Service: ${productName}
Target Customer Persona: ${persona}
Industry: ${industry}

CRITICAL RULES:
- Assume 3-5 days have passed with no reply
- Be polite and respectful of their time
- NO pressure or guilt-tripping
- Offer additional value or context
- Keep it SHORT (60-80 words max)
- Soft close - make it easy to decline or reply
- Reference the initial email subtly
- Sound human and understanding

CRITICAL: Return ONLY valid JSON, no markdown, no extra text.

{
  "subject_line": "Re: [Previous subject - or new short subject]",
  "email_body": "Hi {{FirstName}},\\n\\n[Brief acknowledgment]\\n\\n[Add value or offer help]\\n\\n[Easy out or soft CTA]",
  "cta": "No pressure - just let me know if this is worth exploring.",
  "personalization_tips": ["Keep it friendly", "Respect their time", "Make it easy to say no"]
}`;

      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert at writing polite, effective follow-up emails that get responses without being pushy. You ALWAYS return valid JSON responses.',
            },
            {
              role: 'user',
              content: followUpPrompt,
            },
          ],
          model: this.model,
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: 'json_object' },
        });

        const response = completion.choices[0]?.message?.content || '';
        return this.parseColdEmailResponse(response);
      } catch (error) {
        console.error('Groq API Error:', error);
        throw new Error('Failed to generate follow-up email');
      }
    }
    
    const prompt = `You are an expert sales professional. Create a personalized sales pitch for:

Product/Service: ${productName}
Customer Persona: ${persona}
Industry: ${industry}
Company Size: ${companySize || 'Not specified'}
Budget Range: ${budgetRange || 'Not specified'}

PITCH MODE: ${pitchMode.toUpperCase()}
Tone: ${config.tone}
Length: ${config.length}
Style: ${config.style}

CRITICAL: Return ONLY valid JSON, no markdown, no extra text.

Generate a complete pitch package optimized for the ${pitchMode} mode. Adjust the elevator_pitch and value_proposition to match the specified tone and style, while still providing all formats:

{
  "elevator_pitch": "30-second compelling pitch (2-3 sentences)",
  "value_proposition": "3-4 sentences explaining unique value",
  "differentiators": ["Differentiator 1", "Differentiator 2", "Differentiator 3"],
  "call_to_action": "Specific next step",
  "formats": {
    "email": {
      "subject": "Compelling subject line",
      "body": "Professional email with greeting, value prop, differentiators, and CTA (200-250 words)"
    },
    "linkedin": {
      "message": "Conversational LinkedIn DM (100-120 words, casual but professional)"
    },
    "whatsapp": {
      "message": "Short, punchy WhatsApp message (40-50 words, very casual)"
    }
  }
}

Make each format appropriate for its channel while maintaining the core value proposition.`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales professional specializing in multi-channel sales communication. You ALWAYS return valid JSON responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseMultiFormatPitch(response);
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to generate pitch');
    }
  }

  parseMultiFormatPitch(response) {
    try {
      // Remove any markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      const data = JSON.parse(cleanResponse);
      
      return {
        elevatorPitch: data.elevator_pitch || 'Compelling pitch for your product',
        valueProposition: data.value_proposition || 'Unique value proposition',
        differentiators: data.differentiators || ['Differentiator 1', 'Differentiator 2', 'Differentiator 3'],
        callToAction: data.call_to_action || 'Schedule a demo',
        formats: {
          email: {
            subject: data.formats?.email?.subject || 'Transform Your Business',
            body: data.formats?.email?.body || 'Professional email content here...'
          },
          linkedin: {
            message: data.formats?.linkedin?.message || 'LinkedIn message here...'
          },
          whatsapp: {
            message: data.formats?.whatsapp?.message || 'WhatsApp message here...'
          }
        },
        rawResponse: response,
      };
    } catch (error) {
      console.error('Failed to parse multi-format pitch JSON:', error);
      // Fallback to old parser
      return this.parsePitchResponse(response);
    }
  }

  parseColdEmailResponse(response) {
    try {
      // Remove any markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      const data = JSON.parse(cleanResponse);
      
      return {
        elevatorPitch: 'Cold Email Outreach',
        valueProposition: 'Personalized B2B cold email designed to get responses',
        differentiators: ['Personalized opening', 'Value-focused messaging', 'Soft CTA approach'],
        callToAction: data.cta || 'Schedule a call',
        coldEmail: {
          subject: data.subject_line || 'Quick question about [Company]',
          body: data.email_body || 'Personalized email content...',
          cta: data.cta || 'Would you be open to a brief call?',
          personalizationTips: data.personalization_tips || ['Replace {{FirstName}} with prospect name', 'Research company recent news', 'Reference specific pain points']
        },
        formats: {
          email: {
            subject: data.subject_line || 'Quick question',
            body: data.email_body || 'Cold email content...'
          },
          linkedin: {
            message: 'This mode is optimized for cold email. Switch to LinkedIn mode for LinkedIn messages.'
          },
          whatsapp: {
            message: 'This mode is optimized for cold email. Switch to other modes for messaging apps.'
          }
        },
        rawResponse: response,
      };
    } catch (error) {
      console.error('Failed to parse cold email JSON:', error);
      return {
        elevatorPitch: 'Cold Email Outreach',
        valueProposition: 'Personalized cold email content',
        differentiators: ['Personalized', 'Value-focused', 'Non-spammy'],
        callToAction: 'Schedule a call',
        coldEmail: {
          subject: 'Subject line generation failed',
          body: 'Email body generation failed. Please try again.',
          cta: 'Would you be open to a call?',
          personalizationTips: ['Personalize the opening', 'Research the prospect', 'Reference specific needs']
        },
        formats: {
          email: {
            subject: 'Generation failed',
            body: 'Please try again'
          },
          linkedin: { message: 'Switch to LinkedIn mode' },
          whatsapp: { message: 'Switch to WhatsApp mode' }
        },
        rawResponse: response,
      };
    }
  }

  parsePitchResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());
    
    let elevatorPitch = '';
    let valueProposition = '';
    const differentiators = [];
    let callToAction = '';
    
    let currentSection = '';
    let buffer = [];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('elevator pitch')) {
        currentSection = 'elevator';
        buffer = [];
        continue;
      } else if (lowerLine.includes('value proposition')) {
        if (currentSection === 'elevator') {
          elevatorPitch = buffer.join(' ').trim();
        }
        currentSection = 'value';
        buffer = [];
        continue;
      } else if (lowerLine.includes('differentiator') || lowerLine.includes('key difference')) {
        if (currentSection === 'value') {
          valueProposition = buffer.join(' ').trim();
        }
        currentSection = 'differentiators';
        continue;
      } else if (lowerLine.includes('call-to-action') || lowerLine.includes('next step')) {
        currentSection = 'cta';
        buffer = [];
        continue;
      }
      
      const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
      
      if (cleanLine) {
        if (currentSection === 'elevator' || currentSection === 'value') {
          buffer.push(cleanLine);
        } else if (currentSection === 'differentiators' && differentiators.length < 3) {
          differentiators.push(cleanLine);
        } else if (currentSection === 'cta') {
          buffer.push(cleanLine);
        }
      }
    }
    
    if (currentSection === 'cta') {
      callToAction = buffer.join(' ').trim();
    }
    
    return {
      elevatorPitch: elevatorPitch || 'Compelling elevator pitch for your product',
      valueProposition: valueProposition || 'Unique value proposition tailored to customer needs',
      differentiators: differentiators.length > 0 ? differentiators : ['Key differentiator 1', 'Key differentiator 2', 'Key differentiator 3'],
      callToAction: callToAction || 'Schedule a demo to see the value firsthand',
      rawResponse: response,
    };
  }

  async scoreLead(name, budget, need, urgency, authority, emailContext) {
    // Determine if this is email-only mode
    const isEmailOnlyMode = emailContext && (!budget || !need || !urgency);
    
    const emailSection = emailContext ? `

Recent Email Conversation:
${emailContext}

⚠️ CRITICAL EMAIL ANALYSIS:
${isEmailOnlyMode ? `
🔥 EMAIL-ONLY MODE: Extract ALL information from the email:
- BUDGET: Look for dollar amounts, budget mentions, pricing discussions, ROI expectations
- NEED: Identify pain points, problems, frustrations, business challenges
- URGENCY: Find timeline mentions, deadline pressure, urgency keywords (ASAP, urgent, this week)
- AUTHORITY: Detect job titles, decision-making power, stakeholder mentions
- LEAD NAME: Extract company name or person's name from email signature/content

If information is missing from email, make reasonable inferences based on context.
` : ''}
- Buying intent signals ("when can we start", "pricing details", "contract")
- Urgency indicators ("ASAP", "urgent", "deadline", "this week")
- Engagement level (response speed, question depth, enthusiasm)
- Pain point severity (frustration, problem urgency)
- Decision-making signals ("we're evaluating", "budget approved")

Use email insights to ${isEmailOnlyMode ? 'DETERMINE ALL scores' : 'BOOST or REDUCE scores'} in Budget, Need, Urgency, and Authority dimensions.` : '';

    const prompt = `You are an expert sales analyst specializing in EXPLAINABLE lead qualification.

Analyze this lead with TRANSPARENT scoring:

Lead Name: ${name || 'Extract from email'}
Budget Details: ${budget || 'Extract from email'}
Business Need: ${need || 'Extract from email'}
Urgency Level: ${urgency || 'Extract from email'}
Authority: ${authority || 'Extract from email'}${emailSection}

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
  "reasoning": "[3-4 detailed sentences explaining the overall assessment, key strengths, areas of concern, and why this lead is promising or challenging]",
  "explanation_breakdown": {
    "budget_analysis": "[What we learned about budget from the data]",
    "need_analysis": "[What pain points or needs were identified]",
    "urgency_analysis": "[Timeline and urgency signals detected]",
    "authority_analysis": "[Decision-making power and stakeholders identified]"
  },
  "conversion_probability": "[percentage based on total score]",
  "priority_level": "[Hot Lead (85-100) / Warm Lead (70-84) / Lukewarm Lead (50-69) / Cold Lead (0-49)]",
  "recommended_action": "[Primary next step]",
  "next_actions": [
    {
      "action": "[Specific action to take]",
      "priority": "[High/Medium/Low]",
      "timeline": "[When to do this]"
    },
    {
      "action": "[Second action]",
      "priority": "[High/Medium/Low]",
      "timeline": "[When to do this]"
    },
    {
      "action": "[Third action]",
      "priority": "[High/Medium/Low]",
      "timeline": "[When to do this]"
    }
  ]
}

NEXT ACTIONS GUIDELINES:
- For Hot Leads (85-100): Immediate actions (Schedule demo within 24h, Send executive deck, Call within 2 hours)
- For Warm Leads (70-84): Short-term actions (Send case studies, Schedule call this week, Share pricing)
- For Lukewarm Leads (50-69): Nurture actions (Add to email sequence, Send educational content, Follow up in 2 weeks)
- For Cold Leads (0-49): Long-term nurture (Add to newsletter, Check back in 3 months, Send industry insights)

AI CONFIDENCE & RISK ANALYSIS:
- Provide confidence_score (0-100) based on data quality and completeness
- Provide confidence_reasoning explaining the confidence level
- List up to 2 risks that could affect conversion

Provide 3 specific, actionable next steps with realistic timelines.

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text.`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales analyst specializing in explainable AI and transparent lead scoring. You ALWAYS return valid JSON responses with detailed breakdowns.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseExplainableLeadScore(response);
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to score lead');
    }
  }

  parseExplainableLeadScore(response) {
    try {
      // Remove any markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }
      
      const data = JSON.parse(cleanResponse);
      
      // Validate and ensure all required fields exist
      return {
        leadName: data.lead_name || 'Unknown Lead',
        leadScore: data.lead_score || 0,
        scoreBreakdown: {
          budget: data.score_breakdown?.budget || 0,
          need: data.score_breakdown?.need || 0,
          urgency: data.score_breakdown?.urgency || 0,
          authority: data.score_breakdown?.authority || 0,
        },
        reasoning: data.reasoning || 'Lead evaluation completed based on provided information.',
        explanationBreakdown: data.explanation_breakdown || {
          budget_analysis: 'Budget information analyzed',
          need_analysis: 'Business needs evaluated',
          urgency_analysis: 'Timeline assessed',
          authority_analysis: 'Decision authority reviewed'
        },
        conversionProbability: data.conversion_probability || '0%',
        priorityLevel: data.priority_level || 'Cold Lead',
        recommendedAction: data.recommended_action || 'Further qualification needed.',
        nextActions: data.next_actions || [
          { action: 'Schedule discovery call', priority: 'Medium', timeline: 'This week' },
          { action: 'Send company overview', priority: 'Medium', timeline: 'Within 48 hours' },
          { action: 'Follow up via email', priority: 'Low', timeline: 'Next week' }
        ],
        confidenceScore: data.confidence_score || 75,
        confidenceReasoning: data.confidence_reasoning || 'Based on available information and data quality',
        risks: data.risks || ['Limited information may affect accuracy', 'Additional qualification recommended'],
        rawResponse: response,
      };
    } catch (error) {
      console.error('Failed to parse lead score JSON:', error);
      // Return fallback structure
      return {
        leadName: 'Unknown Lead',
        leadScore: 50,
        scoreBreakdown: {
        explanationBreakdown: {
          budget_analysis: 'Budget information requires clarification',
          need_analysis: 'Some business needs identified',
          urgency_analysis: 'Timeline needs further discussion',
          authority_analysis: 'Decision-making process unclear'
        },
          budget: 12,
          need: 13,
          urgency: 12,
          authority: 13,
        },
        reasoning: 'Lead shows moderate potential. Further qualification recommended.',
        conversionProbability: '40%',
        priorityLevel: 'Lukewarm Lead',
        recommendedAction: 'Schedule discovery call to gather more details.',
        nextActions: [
          { action: 'Schedule discovery call', priority: 'Medium', timeline: 'This week' },
          { action: 'Send company overview', priority: 'Medium', timeline: 'Within 48 hours' },
          { action: 'Follow up via email', priority: 'Low', timeline: 'Next week' }
        ],
        confidenceScore: 65,
        confidenceReasoning: 'Moderate confidence - additional qualification recommended',
        risks: ['Incomplete information may affect accuracy', 'Further discovery needed'],
        rawResponse: response,
      };
    }
  }

  // Keep old parser for backward compatibility
  parseLeadScore(response) {
    const lines = response.split('\n').filter(line => line.trim());
    
    let score = 50;
    let category = 'Warm';
    let conversionProbability = 50;
    let explanation = '';
    let nextAction = '';
    
    const explanationBuffer = [];
    const actionBuffer = [];
    let currentSection = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('score')) {
        const scoreMatch = line.match(/(\d+)/);
        if (scoreMatch) {
          score = parseInt(scoreMatch[1]);
        }
      } else if (lowerLine.includes('category')) {
        if (lowerLine.includes('hot')) category = 'Hot';
        else if (lowerLine.includes('warm')) category = 'Warm';
        else if (lowerLine.includes('lukewarm')) category = 'Lukewarm';
        else if (lowerLine.includes('cold')) category = 'Cold';
      } else if (lowerLine.includes('probability') || lowerLine.includes('conversion')) {
        const probMatch = line.match(/(\d+)/);
        if (probMatch) {
          conversionProbability = parseInt(probMatch[1]);
        }
      } else if (lowerLine.includes('explanation')) {
        currentSection = 'explanation';
        continue;
      } else if (lowerLine.includes('next action') || lowerLine.includes('recommend')) {
        if (currentSection === 'explanation') {
          explanation = explanationBuffer.join(' ').trim();
        }
        currentSection = 'action';
        continue;
      }
      
      if (currentSection === 'explanation') {
        explanationBuffer.push(line.trim());
      } else if (currentSection === 'action') {
        actionBuffer.push(line.trim());
      }
    }
    
    if (currentSection === 'action') {
      nextAction = actionBuffer.join(' ').trim();
    }
    
    return {
      score,
      category,
      conversionProbability,
      explanation: explanation || 'Lead shows moderate potential based on provided information',
      nextAction: nextAction || 'Schedule a discovery call to understand requirements better',
      rawResponse: response,
    };
  }
}

module.exports = new GroqService();
