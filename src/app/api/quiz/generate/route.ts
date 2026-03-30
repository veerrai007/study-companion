import { dbConnect } from "@/lib/DB";
import { NextRequest } from "next/server";
import { generateQuize } from '@/services/aiServices'
import DocumentModel from "@/models/Document";
import QuizModel from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function POST(request: NextRequest) {

    try {        
        
        await dbConnect()
        
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;
        const user = new mongoose.Types.ObjectId(userId);

        const formData = await request.formData();
        const documentId = formData.get('documentId') as string;
        const questionCount = formData.get('questionCount') as string;
        const difficulty = formData.get('difficulty') as string;
        
        const document = await DocumentModel.findOne({
            _id: documentId
        });

        if (!document) {
            return Response.json({
                success: false,
                message: 'Document not found'
            }, { status: 404 });
        }

        if (!document.isProcessed || !document.content) {
            return Response.json({
                success: false,
                message: 'Document is still being processed or has no content'
            }, { status: 400 });
        }

        const quizData = await generateQuize(
            questionCount,
            document.content,
            document.topic,
            difficulty,
        );

        const quiz = new QuizModel({
            user: user,
            document: documentId,
            topic: `Quiz: ${document.topic}`,
            subject: document.subject,
            questions: quizData.questions.map((q: any) => ({
                question: q.question,
                type: q.type,
                options: q.options || [],
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: q.difficulty,
                topic: q.topic,
                points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
            }))
        });

        await quiz.save();

        await DocumentModel.findByIdAndUpdate(documentId, {
            $push: { quizzes: quiz._id }
        });

        return Response.json({
            success: true,
            message: 'Quiz generated successfully',
        }, { status: 201 });

    } catch (error) {
        console.error('Generate quiz error:', error);
        return Response.json({
            success: false,
            message: 'Error generating quiz'
        }, { status: 500 })
    }
}
