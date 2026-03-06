import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Home
        <a href="http://localhost:3000/sign-up">signup</a>
    </div>
  );
}
