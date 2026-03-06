'use client'
import { redirect } from "next/navigation";
import { useSession, signOut } from 'next-auth/react'
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  // if (!session) {
  //   redirect("/sign-in");
  // }

  return (
    <div>
      <h1 className="font-serif">Welcome, {session?.user?.name}!</h1>
      <p>Email: {session?.user?.email}</p>
      <button onClick={()=>{signOut()}} className="bg-red-600">Logout</button>
      <Link className="m-3 underline text-blue-500" href={'documentPage'} >Documents</Link>
    </div>
  );
}
