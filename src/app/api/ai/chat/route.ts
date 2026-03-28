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

      let mockContent = "";
      if (isHindi) {
        mockContent = `नमस्ते ${farmerContext?.name || 'किसान भाई'}, आपके ${farmerContext?.acres || 'खेत'} के लिए मेरा सुझाव यह है:\n\n1. **बाज़ार की स्थिति**: अभी उर्वरक की कीमतें 30-40% अधिक हैं। अपने ${farmerContext?.crops?.[0] || 'फसल'} को अभी बेचना बेहतर होगा।\n2. **सरकारी योजना**: आप PM-Kisan योजना के लिए पात्र हैं, जिससे आपके उर्वरक खर्च में मदद मिलेगी।\n\nक्या मैं आपको ऋण प्राप्ति में मदद कर सकता हूँ?`;
      } else {
        mockContent = `Hello ${farmerContext?.name || 'Farmer'}, based on your ${farmerContext?.acres || 'farm size'} acres of ${farmerContext?.crops?.[0] || 'land'}, here is my tailored advice:\n\n1. **Market Crisis Strategy**: Given the 34% urea price surge, I recommend optimizing your yield and applying for the emergency subsidy immediately.\n2. **Financial Health**: Your current score of ${farmerContext?.healthScore || '650'} indicates you should hold off on taking new heavy machinery loans until Q3.\n\nWould you like me to guide you through applying for the urea subsidy?`;
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
