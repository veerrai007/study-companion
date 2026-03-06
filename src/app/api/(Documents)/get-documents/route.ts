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
        const mongooseID = new mongoose.Types.ObjectId(user);
    
        if (!user) {
            return Response.json({
                success: false,
                message: "User not logined",
            },{status:400})
        }
    
        const documents = await DocumentModel.find({ user: mongooseID });
    
        if (documents.length===0) {
            return Response.json({
                success: false,
                message: "No documents uploaded",
            },{status:400})
        }
    
        return Response.json({
            success: true,
            message: "Documents Fetched",
            data: {
                documents
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