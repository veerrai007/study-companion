import UserModel from "@/models/User";
import { dbConnect } from "@/lib/DB";

export async function POST(request: Request) {

    try {

        const { name, email, password } = await request.json();

        await dbConnect();

        const emailExist = await UserModel.findOne({ email });

        if (emailExist) {
            return Response.json({
                success: false,
            }, { status: 400, statusText: "Email Already Exist" })
        }

        const newUser = new UserModel({
            name,
            email,
            password
        })

        await newUser.save();

        return Response.json({
            success: true,
            message: "Registered",
            user: newUser
        }, { status: 200, statusText: "Signup Completed" })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal Server Error While Register"
        }, { status: 500, statusText: "Internal Server Error" })
    }
}