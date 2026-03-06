import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank', 'short-answer'],
    required: true
  },
  options: [String], // For multiple choice
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 1
  },
  topic: String // Which topic/section this question covers
});

export const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  subject: String,
  
  questions: [questionSchema],
  
  // Quiz attempts/results
  attempts: [{
    attemptNumber: Number,
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      userAnswer: String,
      isCorrect: Boolean,
      timeTaken: Number // seconds
    }],
    score: {
      correct: Number,
      total: Number,
      percentage: Number
    },
    timeSpent: Number, // total time in seconds
    feedback: String // AI-generated feedback
  }],
  
  // Analytics
  totalAttempts: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const QuizModel = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema)

export default QuizModel;