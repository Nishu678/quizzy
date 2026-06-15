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

    // Call Anthropic API
    const anthropic = require("@anthropic-ai/sdk");
    const client = new anthropic.Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are a quiz question generator. Generate ${questionCount} multiple choice questions for a quiz with the following details:

Title: ${title}
Description: ${description}
Category: ${category}
Difficulty: ${difficulty}

Requirements:
- Create ${questionCount} questions appropriate for ${difficulty} level
- Questions should test knowledge thoroughly based on the title and description
- Each question must have exactly 4 options
- Questions should be clear, unambiguous, and factually accurate
- Include brief explanations for the correct answer
- Make questions engaging but challenging

Return ONLY a valid JSON array of questions in this exact format (no markdown, no code blocks):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Note: correctAnswer should be 0-3 (index of the correct option)`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract JSON from response
    const content =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON (handle potential markdown code blocks)
    let questions;
    try {
      // Try parsing directly
      questions = JSON.parse(content);
    } catch {
      // Try extracting from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1]);
      } else {
        // Try finding array in content
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          questions = JSON.parse(arrayMatch[0]);
        } else {
          throw new Error("Could not parse AI response as JSON");
        }
      }
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return a valid questions array");
    }

    // Validate each question has required fields
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
