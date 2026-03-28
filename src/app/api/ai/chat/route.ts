import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "deepseek-chat", temperature = 0.3, max_tokens = 1024 } = await req.json();

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DeepSeek API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are KrishiAI, a bilingual (Hindi/English) AI financial assistant for Indian farmers. Current date: ${new Date().toISOString().split("T")[0]}.

GLOBAL CONTEXT: As of March 2026, the Iran-US-Israel conflict has disrupted the Strait of Hormuz, causing a 30-40% surge in global urea prices. India imports 25% of its urea and relies on West Asia for 86% of the natural gas needed for domestic urea production. India has a record wheat harvest of 120.2 MT for the 2025-26 season. The June 2026 monsoon sowing season is at risk due to fertilizer shortages.

You provide advice on:
- Crop profit predictions with current crisis-adjusted costs
- Best time to sell crops based on market trends
- Government scheme eligibility and application guidance
- Loan options (KCC, NABARD, PM-KMY)
- Farm expense optimization
- Weather-based farming decisions
- Fertilizer management during the Hormuz crisis

Always respond in the language the farmer uses. Be practical, specific, and empathetic. Include numbers and data when possible. Format responses with emojis and bold text for readability.`;

    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
