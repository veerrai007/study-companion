import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import QuizModel  from "@/models/Quiz";

type QueryType = {
    user?: Object
    subject?: RegExp
    document?: string
}

export async function POST(request: NextRequest) {

    try {

        const { page, limit, subject, documentId } = await request.json();
        
        const skip = (page - 1) * limit;

        // const session = await getServerSession(authOptions);
        // const userId = session?.user.id;
        // const user = new mongoose.Types.ObjectId(userId);

        const query: QueryType = {  };
        if (subject) query.subject = new RegExp(subject, 'i');
        if (documentId) query.document = documentId;

        const quizzes = await QuizModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-questions.correctAnswer -questions.explanation');

        const total = await QuizModel.countDocuments(query);

        return Response.json({
            success: true,
            data: {
                quizzes,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    count: quizzes.length
                }
            }
        }, { status: 200 });
    }
    catch (error) {
        console.error('Get quizzes error:', error);
        return Response.json({
            success: false,
            message: 'Error fetching quizzes'
        }, { status: 500 });
    }
}