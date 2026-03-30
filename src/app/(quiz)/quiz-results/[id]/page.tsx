'use client'
import { useContext, useEffect, useState } from 'react';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Share2,
  Brain,
  BarChart3,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen
} from 'lucide-react';
import { InferSchemaType } from 'mongoose';
import { quizSchema } from '@/models/Quiz';
import { useParams, useRouter } from 'next/navigation';
import ApiResponse, { Question } from '@/types/ApiResponse';
import { QuizContext } from '@/context/quizContext';

export default function QuizResults() {
  const { resultt } = useContext(QuizContext)
  const router = useRouter()
  const param = useParams()
  const id = param.id?.toString() || "";

  type QuizType = InferSchemaType<typeof quizSchema>
  const [quiz, setQuiz] = useState<QuizType>()
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchResult = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/quiz/result?id=${id}`, {
      method: "GET",
    })
    const result: ApiResponse = await res.json()
    const quizData = result?.data?.quiz
    setIsLoading(false);

    if (typeof (quizData) === 'object') {
      setQuiz(quizData as unknown as QuizType)
    }
  }

  const results = quiz?.attempts?.[quiz?.attempts.length - 1];

  const toggleQuestionExpansion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-amber-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-rose-400';
  };
  
  const getScoreBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (percentage >= 80) return 'bg-blue-500/10 border-blue-500/20';
    if (percentage >= 70) return 'bg-amber-500/10 border-amber-500/20';
    if (percentage >= 60) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getScoreGrade = (percentage: number) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 95) return { message: "Outstanding! Perfect performance! 🎉", icon: "🏆", color: "text-emerald-400" };
    if (percentage >= 85) return { message: "Excellent work! You've mastered this topic! ⭐", icon: "🌟", color: "text-emerald-400" };
    if (percentage >= 75) return { message: "Good job! You have a solid understanding! 👍", icon: "👍", color: "text-blue-400" };
    if (percentage >= 65) return { message: "Not bad! Some areas need review. 📖", icon: "📚", color: "text-amber-400" };
    if (percentage >= 50) return { message: "Keep studying! You'll get there! 💪", icon: "💪", color: "text-orange-400" };
    return { message: "Don't give up! Review and try again! 🚀", icon: "📖", color: "text-rose-400" };
  };

  const calculateTopicPerformance = () => {
    if (!resultt?.questions) return [];

    const topicStats = {};

    resultt.questions.forEach((q: Question) => {
      const topic = q.topic || 'General';
      // @ts-ignore
      if (!topicStats[topic]) {
        // @ts-ignore
        topicStats[topic] = { correct: 0, total: 0 };
      }
      // @ts-ignore
      topicStats[topic].total++;
      if (q.isCorrect) {
        // @ts-ignore
        topicStats[topic].correct++;
      }
    });

    return Object.entries(topicStats).map(([topic, stats]: any) => ({
      topic,
      percentage: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    })).sort((a, b) => b.percentage - a.percentage);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchResult()
  }, [])

  if (isLoading && !quiz) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
            <div className="flex flex-col items-center space-y-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-purple-400 font-medium">Analyzing Results...</p>
            </div>
        </div>
    )
  }

  if (!resultt) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
            <div className="flex flex-col items-center space-y-4 text-center">
                <Brain className="w-12 h-12 text-purple-500" />
                <p className="text-purple-400 font-medium">No result found. Please take the quiz first.</p>
                <button
                    onClick={() => router.push(`/quiz-take/${id}`)}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors"
                >
                    Take Quiz
                </button>
            </div>
        </div>
    )
  }

  const { score, timeSpent, feedback, questions } = resultt
  const performance = getPerformanceMessage(score.percentage);
  const topicPerformance = calculateTopicPerformance();

  return (
      <div className='bg-[#0f0f13] min-h-screen w-full flex flex-col p-4 md:p-8 font-sans text-gray-200'>
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Header */}
          <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-bl-full pointer-events-none transition-all duration-1000 group-hover:bg-purple-500/10"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <button
                onClick={() => router.push(`/quizzes/${quiz?.document}`)}
                className="flex items-center text-gray-400 hover:text-white transition-colors w-fit group/btn"
              >
                <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover/btn:bg-white/10 transition-colors">
                  <ArrowLeft className="h-5 w-5 transform group-hover/btn:-translate-x-1 transition-transform" />
                </div>
                Back to Quizzes
              </button>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={() => router.push(`/quiz-take/${id}`)}
                  className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors shadow-sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            <div className="text-center relative z-10 animate-in zoom-in duration-500 delay-100">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-3 tracking-tight">
                {quiz?.topic || 'Mission Complete'}
              </h1>
              <p className="text-gray-400 text-lg">Mission Report & Analysis</p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/10 to-pink-600/10 blur-xl px-10"></div>
             
             <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full mb-6 ring-4 ring-offset-4 ring-offset-[#1a1a24] shadow-2xl animate-bounce ${getScoreBg(score.percentage)} ${score.percentage >= 80 ? 'ring-emerald-500/50' : score.percentage >= 60 ? 'ring-amber-500/50' : 'ring-rose-500/50'}`}>
                    {score.percentage >= 80 ? (
                      <Trophy className="h-14 w-14 text-emerald-400" />
                    ) : score.percentage >= 60 ? (
                      <Target className="h-14 w-14 text-amber-400" />
                    ) : (
                      <Brain className="h-14 w-14 text-rose-400" />
                    )}
                  </div>

                  <div className={`text-6xl font-black tracking-tighter mb-4 ${getScoreColor(score.percentage)} drop-shadow-lg`}>
                    {score.percentage}%
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className={`text-2xl font-black px-5 py-2 rounded-xl border ${getScoreBg(score.percentage)} ${getScoreColor(score.percentage)}`}>
                      {getScoreGrade(score.percentage)}
                    </div>
                    <div className="text-gray-400 font-medium px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                      <span className="text-white font-bold">{score.correct}</span> / {score.total} correct
                    </div>
                  </div>

                  <div className={`text-xl font-medium ${performance.color} mb-2 bg-black/20 py-3 px-6 rounded-2xl inline-block border border-white/5`}>
                    {performance.message}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                    <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3 transform group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-white mb-1">{score.correct}</div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Correct</div>
                  </div>

                  <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                    <XCircle className="h-10 w-10 text-rose-400 mx-auto mb-3 transform group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-white mb-1">{score.total - score.correct}</div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Incorrect</div>
                  </div>

                  <div className="text-center p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                    <Clock className="h-10 w-10 text-blue-400 mx-auto mb-3 transform group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-white mb-1">{formatTime(timeSpent || 0)}</div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Time Taken</div>
                  </div>
                </div>
             </div>
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-pink-500"></div>
              <div className="flex items-center mb-6 pl-4">
                <Lightbulb className="h-7 w-7 text-amber-400 mr-3 animate-pulse" />
                <h2 className="text-xl font-bold text-white">AI Analysis & Feedback</h2>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-5 pl-8 relative">
                <p className="text-indigo-200 leading-relaxed text-lg font-medium">{feedback}</p>
              </div>
            </div>
          )}

          {/* Topic Performance */}
          {topicPerformance.length > 0 && (
            <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-purple-500/10 rounded-lg mr-4 border border-purple-500/20">
                   <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Performance by Topic</h2>
              </div>

              <div className="space-y-5">
                {topicPerformance.map((topic, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg text-white">{topic.topic}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 font-medium bg-black/30 px-3 py-1 rounded-full border border-white/5">
                          {topic.correct} / {topic.total} correct
                        </span>
                        <span className={`font-black text-lg ${getScoreColor(topic.percentage)}`}>
                          {topic.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative ${topic.percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                          topic.percentage >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
                          }`}
                        style={{ width: `${topic.percentage}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review */}
          <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-4 border border-blue-500/20">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Question Review</h2>
                  <p className="text-sm text-gray-400 mt-1">Review your answers and learn from mistakes</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {questions?.map((question: any, index: any) => (
                <QuestionReview
                  key={index}
                  question={question}
                  index={index}
                  isExpanded={expandedQuestions.has(index)}
                  onToggle={() => toggleQuestionExpansion(index)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-b from-[#1a1a24] to-[#0f0f13] rounded-2xl p-6 text-center pt-8 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Ready for your next challenge?</h3>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => router.push(`/quiz-take/${id}`)}
                className="group flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20 transform hover:-translate-y-1"
              >
                <RotateCcw className="h-5 w-5 mr-3 group-hover:-rotate-90 transition-transform duration-500" />
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

// Question Review Component
const QuestionReview = ({ question, index, isExpanded, onToggle }: any) => {
  const isCorrect = question.isCorrect;

  return (
    <div className={`border rounded-xl transition-all duration-300 overflow-hidden ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10'
      }`}>
      <div
        className="p-5 md:p-6 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-black/40 text-gray-300 border border-white/10 shadow-inner">
                Q {index + 1}
              </span>

              {isCorrect ? (
                <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Correct</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                  <XCircle className="h-4 w-4 mr-1.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Incorrect</span>
                </div>
              )}

              {question.topic && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {question.topic}
                </span>
              )}
            </div>

            <h3 className="text-base md:text-lg font-medium text-white mb-5 leading-relaxed">
              {question.question}
            </h3>

            <div className="flex flex-col md:flex-row md:items-center text-sm gap-4 md:gap-8 bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="flex items-start md:items-center gap-2">
                 <span className="text-gray-400 font-medium">Your answer:</span>
                 <span className={`font-bold px-2 py-1 rounded-md ${isCorrect ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                   {question.userAnswer || 'No answer provided'}
                 </span>
              </div>

              {!isCorrect && (
                <div className="flex items-start md:items-center gap-2">
                   <span className="text-gray-400 font-medium">Correct answer:</span>
                   <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                     {question.correctAnswer}
                   </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center pt-2 md:pt-0">
            <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-white/10' : 'bg-transparent'}`}>
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-gray-400" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && question.explanation && (
        <div className="border-t border-white/10 p-5 md:p-6 bg-black/40 animate-in slide-in-from-top-2 fade-in duration-300 relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-amber-500/50"></div>
          <div className="flex items-start">
            <div className="p-2 bg-amber-500/10 rounded-lg mr-4 border border-amber-500/20 flex-shrink-0">
               <Lightbulb className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-amber-100 mb-2 font-sans tracking-wide">EXPLANATION</h4>
              <p className="text-gray-300 leading-relaxed text-[15px]">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};