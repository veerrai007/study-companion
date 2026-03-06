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
            return Response.json({
                success: false,
                message: "User not logined",
            },{status:400})
        }
        const mongooseID = new mongoose.Types.ObjectId(user);

        const param = request.nextUrl.searchParams.get('id');
        // if (param) {
        //     const documentID = new mongoose.Types.ObjectId(param);
        // }
    
    
        const document = await DocumentModel.findOne({ user: mongooseID ,_id: param});
    
        if (document.length===0) {
            return Response.json({
                success: false,
                message: "No document",
            },{status:400})
        }
    
        return Response.json({
            success: true,
            message: "Document Fetched",
            data: {
                documentt: document
            }
        },{status:200})
    } 
    catch (error) {
        return Response.json({
            success: false,
            message: "Failed to fetch",
        },{status:500})
    }
}