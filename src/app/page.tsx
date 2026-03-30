import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Sparkles, Zap, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        {/* Abstract Floating Background Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 text-center z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 transition-transform hover:scale-105 cursor-default border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning 2.0</span>
          </div>
          
          {/* Hero Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto mb-8 leading-tight">
            Master Any Subject with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Your Study Companion
            </span>
          </h1>
          
          {/* Hero Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Upload document or study material. We automatically extract key points, generate interactive quizzes, and tailor a personalized learning path to guarantee your success.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/sign-up" 
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(150%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              
              <span className="relative z-10">Get Started for Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/documentPage" 
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-background border-2 border-border text-foreground font-semibold rounded-full hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-300 w-full sm:w-auto"
            >
              <FileText className="w-5 h-5 group-hover:-rotate-6 transition-transform" />
              <span>View Sample Docs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30 border-t border-border/50 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground tracking-tight">Why choose StudyCompanion?</h2>
            <p className="text-muted-foreground text-lg">
              We leverage cutting-edge AI models to dramatically reduce your study time while increasing your retention rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            
            {/* Connecting line behind cards (visible on lg screens) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />

            {/* Feature 1 */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Smart Summaries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Skip the fluff. We instantly read your PDFs and Word docs to extract only the most critical concepts you need to memorize.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 lg:translate-y-4">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Instant Quizzes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate high-quality multiple choice, true/false, and fill-in-the-blank quizzes seamlessly directly from your own material.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by Gemini AI, processing complex documents takes mere seconds, keeping you entirely focused on learning efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="mt-auto py-10 border-t border-border/40 text-center bg-background/50 text-muted-foreground backdrop-blur-md">
        <p className="text-sm font-medium">© {new Date().getFullYear()} StudyCompanion. Accelerating knowledge globally.</p>
      </footer>
    </div>
  );
}
