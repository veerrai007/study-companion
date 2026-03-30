import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import DocumentModel from "@/models/Document";
import { dbConnect } from "@/lib/DB";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        const user = session?.user.id;
        if (!user) {
            return Response.json({ success: false, message: "User not logged in" }, { status: 401 });
        }
        const mongooseID = new mongoose.Types.ObjectId(user);

        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return Response.json({ success: false, message: "Document ID is required" }, { status: 400 });
        }

        const document = await DocumentModel.findOne({ user: mongooseID, _id: id });

        if (!document) {
            return Response.json({ success: false, message: "Document not found" }, { status: 404 });
        }

        return Response.json({
            success: true,
            data: { 
                isProcessed: document.isProcessed,
                document: document.isProcessed ? document : undefined
            }
        }, { status: 200 });

    } catch (error) {
        return Response.json({ success: false, message: "Failed to fetch status" }, { status: 500 });
    }
}
