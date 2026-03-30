import { dbConnect } from "@/lib/DB";
import  QuizModel  from "@/models/Quiz";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest){
    await dbConnect();
    const id = request.nextUrl.searchParams.get('id');

    const quiz = await QuizModel.findOne({
      _id: id,
    });

    if (!quiz) {
      return Response.json({
        success: false,
        message: 'Quiz not found'
      },{status:404});
    }

    return Response.json({
        success:true,
        data:{
          quiz
        }
    })
}