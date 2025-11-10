import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData } = await req.json();
    console.log('Analyzing patient data:', patientData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a medical AI assistant helping patients understand fever recovery. 
Analyze the following patient data and provide clinical decision support.
IMPORTANT: Always recommend consulting a doctor for final decisions. 
Never provide definitive medical advice. Provide evidence-based guidance only.

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no extra text).`;

    const userPrompt = `Patient Assessment:
- Age: ${patientData.age} years
- Temperature: ${patientData.temperature}°C
- Fever Duration: ${patientData.duration} days
- Medication: ${patientData.medicationType}
- Days on medication: ${patientData.daysOnMedication}
- Compliance: ${patientData.compliance}%
- Symptoms: ${patientData.symptoms.join(', ')}
- Comorbidities: ${patientData.comorbidities.join(', ') || 'None'}
- Location: ${patientData.location}

Please analyze this and provide:
1. Recovery probability (0-1 decimal)
2. Confidence level (0-1 decimal)
3. Decision: CONTINUE / CONSULT_DOCTOR / LIKELY_SAFE_TO_STOP
4. Detailed explanation
5. Key factors contributing to decision
6. Risk assessment (LOW/MEDIUM/HIGH)
7. Next steps (array of strings)
8. Warning signs to watch for (array of strings)
9. Clinical note for doctor

Respond ONLY with valid JSON in this exact format:
{
  "decision": "CONTINUE" | "CONSULT_DOCTOR" | "LIKELY_SAFE_TO_STOP",
  "recovery_probability": 0.75,
  "confidence": 0.85,
  "explanation": "detailed explanation here",
  "key_factors": ["factor1", "factor2"],
  "risk_assessment": "LOW" | "MEDIUM" | "HIGH",
  "next_steps": ["step1", "step2"],
  "warning_signs": ["sign1", "sign2"],
  "doctor_note": "clinical recommendation"
}`;

    console.log('Calling Lovable AI...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service credits exhausted. Please contact support." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    let aiContent = data.choices[0].message.content;
    console.log('Raw AI content:', aiContent);
    
    // Clean up the response - remove markdown code blocks if present
    aiContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', aiContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Successfully parsed AI analysis:', aiAnalysis);

    return new Response(JSON.stringify(aiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-fever function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
