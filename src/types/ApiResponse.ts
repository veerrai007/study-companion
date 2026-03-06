import documentSchema from "@/models/Document"
import { quizSchema } from "@/models/Quiz"
export default interface ApiResponse{
    success?:boolean,
    message?:string,
    data?:{
        documentt?: typeof documentSchema,
        documents?: [typeof documentSchema],
        quiz?: typeof quizSchema
        
    }
}