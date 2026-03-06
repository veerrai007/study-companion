import { dbConnect } from "@/lib/DB";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import QuizModel from "@/models/Quiz";

export async function GET(request: NextRequest) {

    try {
        await dbConnect();

        const param = request.nextUrl.searchParams.get('id');

        const session = await getServerSession(authOptions);
        const userId = session?.user.id;
        const user = new mongoose.Types.ObjectId(userId);

        const quiz = await QuizModel.findOne({
            _id: param,
            user
        }).populate('document', 'topic subject');

        if (!quiz) {
            return Response.json({
                success: false,
                message: 'Quiz not found'
            }, { status: 404 });
        }

        const quizForTaking = {
            ...quiz.toObject(),
            questions: quiz.questions.map((q: any) => ({
                _id: q._id,
                question: q.question,
                type: q.type,
                options: q.options,
                topic: q.topic,
                difficulty: q.difficulty,
                points: q.points
            }))
        };

        return Response.json({
            success: true,
            quiz: quizForTaking
        }, { status: 200 })
    }
    catch (error) {

        console.error('Get quiz error:', error);
        return Response.json({
            success: false,
            message: 'Error fetching quiz'
        }, { status: 500 })

    }

}