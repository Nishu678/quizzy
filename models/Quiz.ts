import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: Number,
        required: true // Index of the correct answer in options array
    },
    explanation: {
        type: String,
        default: ""
    }
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Science', 'History', 'Geography', 'Sports', 'Entertainment', 'General Knowledge'],
        default: 'General Knowledge'
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    questions: [QuestionSchema],
    timeLimit: {
        type: Number, // in minutes
        default: null // null means no time limit
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Made optional for demo/testing
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    plays: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
QuizSchema.index({ title: 'text', description: 'text', category: 1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
