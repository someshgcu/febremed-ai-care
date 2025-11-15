/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request body
    if (!req.body) {
      return new Response(
        JSON.stringify({ error: "Request body is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { patientData } = await req.json();
    
    if (!patientData) {
      return new Response(
        JSON.stringify({ error: "patientData is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Analyzing patient data:', patientData);

    // Get Python API URL from environment (set as secret in Supabase)
    // For local development, use: http://localhost:5000
    // For production, use your deployed URL (e.g., https://your-api.onrender.com)
    const PYTHON_API_URL = Deno.env.get("PYTHON_API_URL") || "http://localhost:5000";
    
    if (!PYTHON_API_URL) {
      console.error("PYTHON_API_URL is not configured. Please set it as a secret in Supabase.");
      return new Response(
        JSON.stringify({ 
          error: "AI service is not configured. Please contact support.",
          details: "PYTHON_API_URL secret is missing. Set it in Supabase project settings."
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calling Python API at: ${PYTHON_API_URL}/api/predict-fever`);

    // Call Python Flask API with XGBoost model
    const response = await fetch(
      `${PYTHON_API_URL}/api/predict-fever`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientData: patientData
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Python API error", response.status, errorText);

      if (response.status === 503) {
        return new Response(
          JSON.stringify({ 
            error: "Fever prediction model not available",
            details: "The XGBoost model is not loaded. Please ensure the model is trained and deployed."
          }),
          {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "API rate limit exceeded. Please try again shortly." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`Python API error: ${response.status} - ${errorText}`);
    }

    const aiAnalysis = await response.json();

    if (!aiAnalysis || !aiAnalysis.decision) {
      console.error("Invalid response from Python API", aiAnalysis);
      throw new Error("Invalid response from Python API");
    }

    console.log(`Prediction received: ${aiAnalysis.decision} (confidence: ${aiAnalysis.confidence})`);

    return new Response(JSON.stringify(aiAnalysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
