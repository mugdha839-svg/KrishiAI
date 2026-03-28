import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { crop, land, location, soil, season, costs } = await req.json();

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const prompt = `Given crop: ${crop}, land: ${land} acres, location: ${location}, soil: ${soil}, season: ${season}, 
input costs: ${JSON.stringify(costs)}, 
current fertilizer prices +35% due to Strait of Hormuz disruption.

Calculate: total cost, yield estimate (quintal/acre), mandi price forecast, net profit.
Provide a JSON response with fields: totalCost, estimatedRevenue, netProfit, profitabilityPct, yieldPerAcre, pricePerQuintal, totalYield, aiAdvice (string with farming recommendation).
Return ONLY valid JSON, no markdown.`;

    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [
          { role: "system", content: "You are an agricultural economics expert. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    try {
      const parsed = JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ raw: content, error: "Failed to parse AI response" }, { status: 200 });
    }
  } catch (error) {
    console.error("Predict API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
