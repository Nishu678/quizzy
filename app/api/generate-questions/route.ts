import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, difficulty, questionCount } = await req.json();

    // Validate inputs
    if (!title || !category || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (questionCount < 1 || questionCount > 50) {
      return NextResponse.json(
        { error: "Question count must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Call Groq API (FREE)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Faster model, better rate limits
        messages: [
          {
            role: "system",
            content: "Generate quiz questions as JSON array. Format: [{question, options:[4 choices], correctAnswer:0-3, explanation}]. No markdown."
          },
          {
            role: "user",
            content: `Create ${questionCount} ${difficulty} questions about: ${title}. ${description}. Category: ${category}. Return JSON array only.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4096, // Reduced to avoid rate limits
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      const parsedError = JSON.parse(errorData);

      // Handle rate limit with retry
      if (parsedError.error?.code === 'rate_limit_exceeded') {
        const retryAfter = parsedError.error?.message?.match(/try again in ([\d.]+)s/)?.[1];
        if (retryAfter) {
          return NextResponse.json({
            error: "Rate limit reached",
            retryAfter: parseFloat(retryAfter),
            message: `Please wait ${Math.ceil(parseFloat(retryAfter))} seconds and try again`
          }, { status: 429 });
        }
      }

      throw new Error(`Groq API error: ${groqResponse.status} - ${errorData}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0].message.content;

    // Parse JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch {
      throw new Error("Failed to parse AI response as JSON");
    }

    // Handle different response formats
    let questions = parsedData.questions || parsedData;
    if (!Array.isArray(questions)) {
      throw new Error("AI did not return a questions array");
    }

    // Validate questions
    if (questions.length === 0) {
      throw new Error("AI returned empty questions array");
    }

    for (const q of questions) {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Invalid question format from AI");
      }
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
