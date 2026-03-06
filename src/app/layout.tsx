import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Study Companion",
  description: "AI study companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Nav/>
          {children}
          <Toaster />
        </body>

      </AuthProvider>
    </html>
  );
}
