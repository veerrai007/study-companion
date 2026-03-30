import documentSchema from "@/models/Document"
import { quizSchema } from "@/models/Quiz"

type Score = {
    correct: number,
    total: number,
    percentage: number
}

export type Question = {
    question: string,
    correctAnswer: string,
    userAnswer: string,
    isCorrect: boolean,
    explanation: string,
    topic: string
}

export type Results = {
    score: Score,
    timeSpent: number,
    feedback: string,
    questions: [Question]
}

export type PaginationType = {
    current: number,
    total: number,
    count: number
}

export default interface ApiResponse {
    success?: boolean,
    message?: string,
    data?: {
        documentt?: typeof documentSchema,
        documents?: [typeof documentSchema],
        quiz?: typeof quizSchema,
        quizzes?: [typeof quizSchema],
        attempt?: number,
        result?: Results
        pagination?:PaginationType
    }
}