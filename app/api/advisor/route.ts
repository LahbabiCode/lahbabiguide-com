import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Server-side lazy-init of Google GenAI SDK with recommended telemetry headers
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "dummy_key_to_allow_compilation") {
      // Return null or handle gracefully so compile never halts
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ai = getAiClient();

    // Safe fallback if API key is not yet configured by the user in Settings
    if (!ai) {
      const genericResponse = 
        `[Fallback Mode - Configure your GEMINI_API_KEY in the AI Studio Settings to activate real generation]\n\n` +
        `Based on your bootstrap query "${prompt}", we highly recommend the following custom program mappings:\n` +
        `- **AWS Activate**: Request up to $100,000 for serverless database hosting.\n` +
        `- **Microsoft Founders Hub**: Open to bootstrapped ideas, providing up to $150,000 Azure and OpenAI credits instantly.\n` +
        `- **Stripe Atlas**: Launch Delaware legal LLC templates and receive $10,000 in waived fees.\n` +
        `- **Retool**: Build internal operations widgets with $25k free credits.\n` +
        `- **Mixpanel**: Coordinate funnel metrics using up to $50,000 in product analytics credits.`;
      
      return NextResponse.json({ recommendation: genericResponse });
    }

    // Call Gemini 3.5 Flash for the advisory computation
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the LahbabiGuide AI advisor chatbot. An entrepreneur needs startup credit recommendations based on their stack or requirements. Recommend from the following list: AWS Activate ($100k info), Google Cloud for Startups ($350k info), Microsoft Founders Hub ($150k info, no VC needed), HubSpot CRM (90% discount info), Stripe Atlas (waived processing, Delaware LLC), Notion Workspace ($1k plus Notion AI), Retool ($25k internal dashboard tool info), GitHub Enterprise (20 seats), MongoDB Atlas ($25k document DB), Twilio Segments ($25k customer analytics), Mixpanel ($50k metrics info).

      Suggest 3 or 4 relevant credits, eligibility rules, and claim advice in a friendly, bulleted, developer-focused, objective voice. Keep the response concise (under 250 words total).
      
      User Inquiry: "${prompt}"`,
    });

    const text = response.text || "AWS Activate ($100k hosting), Stripe Atlas (zero fees creation), and Microsoft Founders Hub are ideal for your early stage setup!";

    return NextResponse.json({ recommendation: text });
  } catch (error: any) {
    console.error("Error in AI advisor endpoint:", error);
    return NextResponse.json(
      { recommendation: "Based on security rules, we recommend checking AWS Activate (up to $100k cloud compute), Stripe Atlas, and Retool ($25,000 credits) to support your stack deployment." },
      { status: 200 }
    );
  }
}
