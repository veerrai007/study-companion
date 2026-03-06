import { NextRequest } from "next/server";
import { join } from 'path'
import { writeFile } from "fs/promises";
import documentProcessor from "@/services/documentProcessor";
import { analyzeDocument } from "@/services/aiServices";
import DocumentModel from "@/models/Document";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/DB";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions)
    const user = session?.user.id
    const mongooseID = new mongoose.Types.ObjectId(user)

    try {

        await dbConnect();
        const formData = await request.formData();
        const topic = formData.get('title') as string;
        const subject = formData.get('subject') as string;
        const file = formData.get('document') as File;

        if (!file) {
            return Response.json(
                {
                    success: false,
                    message: "No document uploaded!",
                },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filePath = join(uploadDir, file.name);

        await writeFile(filePath, buffer);

        const fileType = documentProcessor.getFileType(file.type)



        const document = new DocumentModel({
            user: mongooseID,
            topic,
            subject,
            filePath: filePath,
            fileType: fileType,
        })
        await document.save();

        backgroundProcess(document._id)

        return Response.json(
            {
                success: true,
                message: "Document Uploaded",
                data: document
            },
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Error while upload'
            },
            { status: 500 }
        )
    }
}

async function backgroundProcess(documentId: typeof mongoose.Types.ObjectId) {

    try {

        await dbConnect();
        const document = await DocumentModel.findById(documentId)
        
        const rawContent = await documentProcessor.extractText(document.filePath, document.fileType)
        const content = documentProcessor.cleanText(rawContent)        
        
        const analysis = await analyzeDocument(document.topic,document.subject,content)
        
        await DocumentModel.findByIdAndUpdate(documentId, {
          content:content,
          summery: analysis.summary,
          keyPoints: analysis.keyPoints,
          topics: analysis.topics,
          isProcessed:true
        });

        console.log(`Document processed successfully: ${document.topic}`);
        documentProcessor.removeFile(document.filePath);
    } 
    catch (error) {
        console.error(`Error processing document ${documentId}:`, error);
    }

}