import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

// GET all quizzes
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");

    let query: any = { isPublished: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const quizzes = await Quiz.find(query)
      .sort({ plays: -1, rating: -1, createdAt: -1 })
      .select("title description category difficulty questions timeLimit createdBy plays rating isPublished createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      quizzes,
      count: quizzes.length,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Error fetching quizzes" }, { status: 500 });
  }
}

// POST create new quiz
export async function POST(request: Request) {
  try {
    await dbConnect();

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.difficulty || !data.questions || data.questions.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user ID from request (if authenticated)
    // For now, not requiring auth for demo
    const createdBy = data.createdBy || null;

    const quiz = await Quiz.create({
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      questions: data.questions,
      timeLimit: data.timeLimit,
      createdBy,
      isPublished: true, // Auto-publish
      plays: 0,
      rating: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Quiz created successfully",
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Error creating quiz" }, { status: 500 });
  }
}
