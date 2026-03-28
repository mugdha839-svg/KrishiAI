import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "deepseek-reasoner", farmerContext, max_tokens = 1024 } = await req.json();

    const lastUserMsg = messages[messages.length - 1]?.content || "Hello";
    const isHindi = farmerContext?.language === "Hindi" || lastUserMsg.match(/[\u0900-\u097F]/);

    const serveMockResponse = (reason: string) => {
      console.log(`Serving simulated DeepSeek-R1 response. Reason: ${reason}`);
      let mockReasoning = `Analyzing user question...\nChecking farmer context...\nUser is ${farmerContext?.name || "a Farmer"} from ${farmerContext?.state || "India"} with ${farmerContext?.acres || 0} acres of ${farmerContext?.crops?.[0] || 'land'}.\n`;
      mockReasoning += `Health Score is ${farmerContext?.healthScore || 0}.\n`;
      mockReasoning += "Factoring in the 34% fertilizer cost spike due to Strait of Hormuz crisis.\n";
      mockReasoning += "Formulating best agro-financial advice in " + (isHindi ? "Hindi" : "English") + "...";

      const query = lastUserMsg.toLowerCase();
      let mockContent = "";

      if (query.includes("sell") || query.includes("wheat") || query.includes("market") || query.includes("price")) {
        mockContent = `**Market Analysis for your ${farmerContext?.crops?.[0] || 'Wheat'}:**\n\n1. **Current Trend**: Prices are currently stable but expected to rise due to the ongoing fertilizer shortage impacting future yields.\n2. **Recommendation**: Hold your stock for another 2-3 weeks if you have storage capability. Government MSP is ₹2,275 but private mandis in ${farmerContext?.district || 'your area'} are currently offering up to ₹2,400.\n\nShould I check nearby mandi contacts for you?`;
      } else if (query.includes("fertilizer") || query.includes("urea") || query.includes("rice")) {
         mockContent = `**Fertilizer Strategy:**\n\n1. **Optimization**: Given the 34% cost spike due to the Strait of Hormuz crisis, I strongly recommend splitting urea application into 3 smaller doses to maximize efficiency.\n2. **Alternatives**: Consider Nano Urea liquid—it's significantly cheaper right now (₹240/bottle) and replaces a full 45kg bag. Use Azolla in your paddies to naturally boost nitrogen.\n\nWant a cost breakdown for your ${farmerContext?.acres || '12'} acres?`;
      } else if (query.includes("pm-kisan") || query.includes("scheme") || query.includes("eligible")) {
         mockContent = `**PM-Kisan Eligibility Check:**\n\nYes! Since you own ${farmerContext?.acres || '12'} acres of cultivable land and have a valid Aadhaar linked to your bank account, you are officially eligible for the ₹6,000/year income support.\n\n**Next Steps**:\n1. Ensure your land records are verified on the government portal.\n2. Complete your e-KYC before the next installment hits in May.\n\nNeed the direct application link?`;
      } else if (query.includes("costs") || query.includes("reduce") || query.includes("expense")) {
         mockContent = `**Cost Reduction Strategies:**\n\nTo offset the massive 30-40% spike in fertilizer costs, try these immediately on your farm:\n1. **Soil Testing**: Don't guess fertilizer amounts. A basic test can save you ₹2000/acre in over-application.\n2. **Direct Seeded Rice (DSR)**: If you're plotting rice next, DSR saves up to 30% on labor and water pumping costs.\n3. **Solar Pumps**: Leverage the PM-KUSUM scheme for heavily subsidized solar pumps to cut diesel expenses entirely.`;
      } else if (query.includes("next season") || query.includes("best crop") || query.includes("grow")) {
         mockContent = `**Crop Recommendation for Next Season:**\n\nBased on your soil patterns and the predicted monsoon in ${farmerContext?.state || 'Punjab'}:\n1. **Short-duration Pulses (Moong)**: Extremely profitable right now, requiring minimal fertilizer which perfectly bypasses the current urea crisis.\n2. **Maize (Spring)**: High demand from the poultry sector and far less water-intensive than late-sown wheat.\n\nLet me know if you want a detailed profit margin comparison!`;
      } else if (query.includes("crisis") || query.includes("affecting")) {
         mockContent = `**Hormuz Crisis Impact on Your Farm:**\n\nThe ongoing conflict has severely disrupted natural gas shipments, directly causing India's urea import costs to spike up to 40%.\n\n**What this means for you**:\n1. Your input costs for the upcoming Kharif season will be significantly higher.\n2. Subsidies might be delayed or strictly rationed by local authorities.\n\n**Action:** Pre-book your fertilizer needs locally now, or rapidly pivot to low-nitrogen crops like pulses.`;
      } else {
        if (isHindi) {
          mockContent = `नमस्ते ${farmerContext?.name || 'किसान भाई'}, आपके सवाल "${lastUserMsg}" के लिए मेरा विश्लेषण:\n\n1. **बाज़ार की स्थिति**: अभी उर्वरक की कीमतें 30-40% अधिक हैं। अपने ${farmerContext?.crops?.[0] || 'फसल'} को अभी बेचना बेहतर होगा।\n2. **सरकारी योजना**: आप PM-Kisan योजना के लिए पात्र हैं, जिससे आपके उर्वरक खर्च में मदद मिलेगी।\n\nक्या मैं आपको किसी विशेष विषय पर जानकारी दूँ?`;
        } else {
          mockContent = `Hello ${farmerContext?.name || 'Farmer'}! I have successfully processed your query: "${lastUserMsg}".\n\nGiven your ${farmerContext?.acres || '12'} acres of ${farmerContext?.crops?.[0] || 'land'}, my DeepSeek reasoning engine recommends leaning into low-nitrogen crop alternatives heavily this month to bypass the 34% urea cost spike.\n\nCould you clarify if you are planning to sow a new batch soon, or are you looking to optimize current operational expenses?`;
        }
      }

      return NextResponse.json({
        choices: [
          {
            message: {
              role: "assistant",
              content: mockContent,
              reasoning_content: mockReasoning
            }
          }
        ]
      });
    };

    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === "undefined" || DEEPSEEK_API_KEY === "") {
      return serveMockResponse("API Key missing or invalid");
    }

    const systemPrompt = `You are KrishiAI, a bilingual (Hindi/English) AI financial assistant for Indian farmers powered by DeepSeek. Current date: ${new Date().toISOString().split("T")[0]}.

${farmerContext ? `--- FARMER PROFILE ---
Name: ${farmerContext.name}
Location: ${farmerContext.district}, ${farmerContext.state}
Land: ${farmerContext.acres} acres
Language Preference: ${farmerContext.language}
Current Crops: ${farmerContext.crops?.join(', ')}
Active Loans: ${farmerContext.loans?.length || 0}
Farm Health Score: ${farmerContext.healthScore}
---` : ''}

GLOBAL CONTEXT: As of March 2026, the Iran-US-Israel conflict has disrupted the Strait of Hormuz, causing a 30-40% surge in global urea prices. India imports 25% of its urea and relies on West Asia for 86% of the natural gas needed for domestic urea production. India has a record wheat harvest of 120.2 MT for the 2025-26 season. The June 2026 monsoon sowing season is at risk due to fertilizer shortages.

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
        max_tokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error (${response.status}):`, errorText);
      return serveMockResponse(`API Error ${response.status}`);
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
