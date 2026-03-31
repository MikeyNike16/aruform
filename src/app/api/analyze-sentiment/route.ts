import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || !String(content).trim()) {
      return NextResponse.json(
        { error: "Content is required for analysis" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { fallback: true },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert psychologist and existential therapist analyzing journal entries. Provide:

1. Seven emotional/existential scores on 1-10 scale
2. A brief summary of what they wrote
3. Two validating arguments (why they're right to feel this way)
4. Two counter-arguments (why their thinking might be flawed)

SCORING GUIDANCE:
MOOD (1=very negative, 5=neutral, 10=euphoric)
ENERGY (1=exhausted, 5=moderate, 10=highly energized)
STRESS (1=very calm, 5=moderate, 10=extremely stressed)
MEANING (1=meaningless, 5=moderate purpose, 10=profound meaning)
EXISTENTIAL_DREAD (1=peaceful, 5=moderate, 10=intense void/mortality anxiety)
CONNECTION (1=isolated, 5=moderate, 10=deeply connected)
AUTHENTICITY (1=inauthentic/false self, 5=moderate, 10=completely authentic)

Be nuanced. Consider negations, intensifiers, narrative arc, implicit emotions, coping mechanisms.

RESPOND WITH VALID JSON ONLY (no markdown, no extra text):
{
  "mood": 7,
  "energy": 5,
  "stress": 6,
  "meaning": 8,
  "existentialDread": 3,
  "connection": 7,
  "authenticity": 6,
  "confidence": 0.85,
  "summary": "Brief 1-2 sentence summary of what they wrote",
  "validatingArguments": [
    "First argument validating their feelings",
    "Second argument validating their feelings"
  ],
  "counterArguments": [
    "First counter-argument showing potential cognitive bias or narrow thinking",
    "Second counter-argument offering alternative perspective"
  ]
}`,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    const responseText = completion.choices[0].message.content?.trim();

    if (!responseText) {
      throw new Error("Empty response from OpenAI");
    }

    // Extract JSON (handle markdown code blocks if present)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate scores
    if (
      analysis.mood < 1 || analysis.mood > 10 ||
      analysis.energy < 1 || analysis.energy > 10 ||
      analysis.stress < 1 || analysis.stress > 10
    ) {
      throw new Error("Invalid score ranges");
    }

    if (analysis.meaning && (analysis.meaning < 1 || analysis.meaning > 10)) {
      throw new Error("Invalid meaning score");
    }
    if (analysis.existentialDread && (analysis.existentialDread < 1 || analysis.existentialDread > 10)) {
      throw new Error("Invalid existential dread score");
    }
    if (analysis.connection && (analysis.connection < 1 || analysis.connection > 10)) {
      throw new Error("Invalid connection score");
    }
    if (analysis.authenticity && (analysis.authenticity < 1 || analysis.authenticity > 10)) {
      throw new Error("Invalid authenticity score");
    }

    // Validate summary and arguments
    if (
      !analysis.summary ||
      !Array.isArray(analysis.validatingArguments) ||
      !Array.isArray(analysis.counterArguments) ||
      analysis.validatingArguments.length < 2 ||
      analysis.counterArguments.length < 2
    ) {
      throw new Error("Missing or invalid summary/arguments in response");
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);

    return NextResponse.json(
      {
        fallback: true,
        error: error.message,
      },
      { status: 200 }
    );
  }
}
