import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/DB";
import DocumentModel from "@/models/Document";
import QuizModel from "@/models/Quiz";

export async function DELETE(request: NextRequest) {

    try {

        await dbConnect();

        const session = await getServerSession(authOptions);
        const user = session?.user.id;
        if (!user) {
            return Response.json({
                success: false,
                message: "User not logined",
            }, { status: 400 })
        }
        const mongooseID = new mongoose.Types.ObjectId(user);

        const param = request.nextUrl.searchParams.get('id');

        if (!param) {
            return Response.json({
                success: false,
                message: "No document id",
            }, { status: 400 })
        }

        const document = await DocumentModel.findOne({ user: mongooseID, _id: param });

        if (!document) {
            return Response.json({
                success: false,
                message: "No document",
            }, { status: 400 })
        }

        await QuizModel.deleteMany({ document: document._id });

        await document.deleteOne();

        return Response.json({
            success: true,
            message: "Document deleted successfully",
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Failed to delete document",
        }, { status: 500 })
    }


}