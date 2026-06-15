import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

// GET single quiz
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const quiz = await Quiz.findById(params.id);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Error fetching quiz" }, { status: 500 });
  }
}

// PUT update quiz
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const data = await request.json();
    const quiz = await Quiz.findById(params.id);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // TODO: Check if user is the creator
    // For now, skip auth check

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Error updating quiz" }, { status: 500 });
  }
}

// DELETE quiz
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const quiz = await Quiz.findById(params.id);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // TODO: Check if user is the creator
    // For now, skip auth check

    await Quiz.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Error deleting quiz" }, { status: 500 });
  }
}
