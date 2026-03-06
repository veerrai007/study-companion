import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/User";
import { dbConnect } from "@/lib/DB";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({

            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any) {

                try {                    
                    await dbConnect();
                    const user = await UserModel.findOne({ email: credentials?.email })
                    if (!user) {
                        throw new Error("Invalid Credentials!");
                    }
                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (passwordMatch) {
                        return user;
                    } else {
                        throw new Error("Incorrect Password!");
                    }
                } 
                catch (error: any) {
                    console.log(error.message);
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {

            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
    pages: {
        signIn: 'sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)