import { dbConnect } from "@/lib/DB";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import QuizModel from "@/models/Quiz";


export async function POST(request: NextRequest) {

    try {

        const { answers, timeSpent } = await request.json();

        if (!answers || !Array.isArray(answers)) {
            return Response.json({
                success: false,
                message: 'Answers array is required'
            }, { status: 400 });
        }

        await dbConnect();

        const id = request.nextUrl.searchParams.get('id');

        const session = await getServerSession(authOptions);
        const userId = session?.user.id;
        const user = new mongoose.Types.ObjectId(userId);

        const quiz = await QuizModel.findOne({
            _id: id,
        });

        if (!quiz) {
            return Response.json({
                success: false,
                message: 'Quiz not found'
            }, { status: 404 });
        }

        // Calculate results
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        const attemptAnswers = answers.map((userAnswer, index) => {
            const question = quiz.questions[index];
            if (!question) return null;

            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) {
                correctCount++;
                earnedPoints += question.points;
            }
            totalPoints += question.points;

            return {
                questionId: question._id,
                userAnswer,
                isCorrect,
                timeTaken: Math.floor(timeSpent / quiz.questions.length) // Estimate per question
            };
        }).filter(Boolean);

        const percentage = Math.round((correctCount / quiz.questions.length) * 100);
        const feedback = "Temporary feedback..................";

        // Create attempt record
        const attempt = {
            attemptNumber: quiz.attempts.length + 1,
            startedAt: new Date(Date.now() - (timeSpent * 1000)),
            completedAt: new Date(),
            answers: attemptAnswers,
            score: {
                correct: correctCount,
                total: quiz.questions.length,
                percentage
            },
            timeSpent: timeSpent || 0,
            feedback
        };

        // Update quiz with attempt
        quiz.attempts.push(attempt);
        quiz.totalAttempts += 1;
        quiz.averageScore = Math.round(
            quiz.attempts.reduce((sum: any, att: any) => sum + att.score.percentage, 0) / quiz.attempts.length
        );
        quiz.bestScore = Math.max(quiz.bestScore, percentage);

        await quiz.save();

        const results = {
            score: attempt.score,
            timeSpent: attempt.timeSpent,
            feedback: attempt.feedback,
            questions: quiz.questions.map((q: any, index: any) => ({
                question: q.question,
                correctAnswer: q.correctAnswer,
                userAnswer: answers[index],
                isCorrect: answers[index] === q.correctAnswer,
                explanation: q.explanation,
                topic: q.topic
            }))
        };

        return Response.json({
            success: true,
            message: 'Quiz completed successfully',
            results,
            attempt: attempt.attemptNumber
        }, { status: 200 })


    } catch (error) {

        console.error('Submit quiz attempt error:', error);
        return Response.json({
            success: false,
            message: 'Error submitting quiz attempt'
        }, { status: 500 })
    }
}