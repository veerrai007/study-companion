'use client'
import { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ApiResponse from '@/types/ApiResponse';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Flag, Pause, Play, Loader2, Sparkles } from 'lucide-react';
import { QuizContext } from '@/context/quizContext';

export default function QuizTakePage() {
    const { setResult } = useContext(QuizContext);
    const router = useRouter();
    const param = useParams();
    const id = param.id?.toString() || "";

    const [quiz, setQuiz] = useState<any>()
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizStartTime, setQuizStartTime] = useState<number>();
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [quizPaused, setQuizPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAll = async () => {
        setIsLoading(true)
        const res = await fetch(`/api/quiz/get-single?id=${id}`, {
            method: "GET",
        })
        const result: ApiResponse = await res.json()
        const quizData = result?.data?.quiz
        setIsLoading(false)

        if (typeof (quizData) === 'object') {
            setQuiz(quizData)
        }
    }

    const handleSubmitQuiz = async () => {
        const timeSpent = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;
        const answerArray = quiz?.questions.map((_: any, index: any) => answers[index as keyof typeof answers] || '');
        setIsLoading(true)
        const res = await fetch(`/api/quiz/submit?id=${id}`, {
            method: "POST",
            headers: { contentType: 'application/json' },
            body: JSON.stringify({ answers: answerArray, timeSpent })
        })
        const result: ApiResponse = await res.json()
        setResult(result?.data?.result)
        router.push(`/quiz-results/${id}`)
    }

    const handlePauseResume = () => {
        setQuizPaused(!quizPaused);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setQuizStartTime(Date.now());
    };

    const handleAnswerChange = (questionIndex: any, answer: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const goToQuestion = (index: any) => {
        setCurrentQuestion(index);
    };

    const goToNextQuestion = () => {
        if (currentQuestion < quiz?.questions?.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const getCompletionStats = () => {
        const answered = Object.keys(answers).length;
        const total = quiz?.questions?.length || 0;
        return { answered, total };
    };

    useEffect(() => {
        fetchAll()
    }, [])

    if (isLoading && !quiz) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center space-y-4 animate-pulse">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                    <p className="text-purple-400 font-medium">Loading Quiz Mission...</p>
                </div>
            </div>
        )
    }

    if (!quizStarted) {
        return (
            <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-4'>
                <div className="max-w-2xl w-full mx-auto relative group">
                    {/* Animated glowing background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    
                    <div className="relative bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm overflow-hidden animate-in fade-in zoom-in duration-500">
                        
                        {/* Shimmer effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shimmer" />

                        <div className="text-center mb-8 relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="bg-purple-500/10 p-5 rounded-full ring-1 ring-purple-500/30 animate-bounce transition-all duration-300">
                                    <Brain className="h-14 w-14 text-purple-400" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-3 tracking-tight">
                                {quiz?.topic || 'Awesome Quiz'}
                            </h1>
                            <p className="text-gray-400 text-lg">Prepare to test your knowledge.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                                        <BookOpen className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <span className="font-semibold text-gray-200">Questions</span>
                                </div>
                                <span className="text-2xl font-bold text-white">{quiz?.questions?.length || 0}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="p-3 bg-pink-500/20 rounded-lg mr-4">
                                        <Sparkles className="h-6 w-6 text-pink-400" />
                                    </div>
                                    <span className="font-semibold text-gray-200">Points Total</span>
                                </div>
                                <span className="text-2xl font-bold text-white">{quiz?.questions?.reduce((acc: number, cur: any) => acc + (cur.points || 1), 0)}</span>
                            </div>
                        </div>

                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mb-10 relative z-10">
                            <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Before you begin
                            </h3>
                            <ul className="text-gray-300 space-y-3 font-medium">
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-3" />
                                    Read each question carefully before answering.
                                </li>
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-3" />
                                    You can navigate freely between questions.
                                </li>
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-3" />
                                    Your progress is tracked automatically. Submit when done.
                                </li>
                            </ul>
                        </div>

                        <div className="text-center relative z-10">
                            <button
                                onClick={handleStartQuiz}
                                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/25 w-full md:w-auto overflow-hidden relative"
                            >
                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                                <Play className="h-5 w-5 mr-2 relative z-10" />
                                <span className="relative z-10">Start Mission</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = quiz?.questions[currentQuestion];
    const stats = getCompletionStats();
    const progress = (stats.answered / (stats.total || 1)) * 100;

    return (
        <div className='bg-[#0f0f13] min-h-screen w-full flex flex-col p-4 md:p-8 font-sans text-gray-200 transition-colors duration-500'>
            <div className="w-full max-w-6xl mx-auto space-y-6">
                
                {/* Header Navbar */}
                <div className="bg-[#1a1a24] border border-white/5 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center w-full md:w-auto">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all mr-4 transform hover:scale-105"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">{quiz?.topic}</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Question <span className="text-white font-semibold">{currentQuestion + 1}</span> of {quiz?.questions.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 w-full md:w-auto flex-1 md:flex-none justify-between">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Progress</span>
                            <span className="text-sm font-bold text-purple-400">{Math.round(progress)}% Complete</span>
                        </div>
                        {/* Circular Progress (mobile) or Bar (desktop) could go here. Let's keep it simple */}
                        <div className="w-full md:w-48 bg-gray-800 rounded-full h-2.5 hidden md:block overflow-hidden shadow-inner">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>

                        <button
                            onClick={handlePauseResume}
                            className="p-3 bg-white/5 text-gray-300 rounded-xl hover:text-white hover:bg-white/10 transition-all transform hover:scale-105"
                            title={quizPaused ? 'Resume Quiz' : 'Pause Quiz'}
                        >
                            {quizPaused ? <Play className="h-5 w-5 fill-current" /> : <Pause className="h-5 w-5 fill-current" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="md:hidden w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Paused Overlay */}
                {quizPaused && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl p-10 text-center max-w-sm w-full mx-4 transform transition-all scale-100">
                            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Pause className="h-10 w-10 text-purple-400 fill-current" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Quiz Paused</h2>
                            <p className="text-gray-400 mb-8">Take a deep breath. You can resume whenever you're ready.</p>
                            <button
                                onClick={handlePauseResume}
                                className="w-full py-4 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                            >
                                Resume Quiz
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Question Area */}
                    <div className="lg:w-3/4 flex flex-col space-y-6">
                        <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden relative group">
                            
                            {/* Animated background hint */}
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-bl-full pointer-events-none transition-all duration-1000 group-hover:bg-purple-500/10"></div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                                {/* Question Header */}
                                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="px-4 py-1.5 rounded-lg text-sm font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                                            Q {currentQuestion + 1}
                                        </span>
                                        {currentQ?.difficulty && (
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                                                    currentQ.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    currentQ.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {currentQ.difficulty}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 bg-black/20 px-3 py-1 rounded-full">
                                        {currentQ?.points || 1} {currentQ?.points === 1 ? 'Point' : 'Points'}
                                    </span>
                                </div>

                                <h2 key={`q-${currentQuestion}`} className="text-2xl md:text-3xl font-semibold text-white leading-relaxed mb-10 animate-in slide-in-from-right-4 fade-in duration-500">
                                    {currentQ?.question}
                                </h2>

                                {/* Question Content */}
                                <div key={`opts-${currentQuestion}`} className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-backwards mt-auto">
                                    {currentQ?.type === 'multiple-choice' && (
                                        <MultipleChoice
                                            question={currentQ}
                                            selectedAnswer={answers[currentQuestion as keyof typeof answers]}
                                            onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                        />
                                    )}

                                    {currentQ?.type === 'true-false' && (
                                        <TrueFalse
                                            question={currentQ}
                                            selectedAnswer={answers[currentQuestion as keyof typeof answers]}
                                            onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                        />
                                    )}

                                    {currentQ?.type === 'fill-in-the-blank' && (
                                        <FillBlank
                                            selectedAnswer={answers[currentQuestion as keyof typeof answers]}
                                            onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="bg-black/20 p-4 md:p-6 border-t border-white/5 flex justify-between items-center relative z-10">
                                <button
                                    onClick={goToPreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="group flex items-center px-5 py-3 text-sm font-semibold text-gray-300 bg-white/5 rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                    Previous
                                </button>

                                <div className="flex space-x-3">
                                    {currentQuestion === (quiz?.questions?.length || 1) - 1 ? (
                                        <button
                                            onClick={() => setShowConfirmSubmit(true)}
                                            className="group flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5"
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Finish Quiz
                                        </button>
                                    ) : (
                                        <button
                                            onClick={goToNextQuestion}
                                            className="group flex items-center px-6 py-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 transform hover:-translate-y-0.5"
                                        >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/4 space-y-6">
                        
                        {/* Question Navigator */}
                        <div className="bg-[#1a1a24] border border-white/5 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5 pb-4 border-b border-white/10">Question Map</h3>
                            
                            <div className="grid grid-cols-5 gap-2 md:gap-3 mb-6">
                                {quiz?.questions.map((_: any, index: number) => {
                                    const isCurrent = index === currentQuestion;
                                    const isAnswered = !!answers[index as keyof typeof answers];
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => goToQuestion(index)}
                                            className={`
                                                relative w-full aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-110
                                                ${isCurrent 
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110 z-10 border border-purple-400' 
                                                    : isAnswered 
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                                                        : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white'
                                                }
                                            `}
                                        >
                                            {index + 1}
                                            {isAnswered && !isCurrent && (
                                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex flex-col space-y-3 mt-4 text-xs font-medium bg-black/20 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-white/10 rounded mr-2"></div>
                                        <span className="text-gray-400">Not Visited</span>
                                    </div>
                                    <span className="text-gray-500">{stats.total - stats.answered}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-emerald-500/30 border border-emerald-500/50 rounded mr-2"></div>
                                        <span className="text-emerald-400">Answered</span>
                                    </div>
                                    <span className="text-emerald-500 font-bold">{stats.answered}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Submit Block */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 rounded-2xl p-6 text-center shadow-xl">
                            <Brain className="h-10 w-10 text-purple-400/50 mx-auto mb-3" />
                            <h4 className="text-white font-semibold mb-1">Ready to finish?</h4>
                            <p className="text-xs text-gray-400 mb-4">Double-check your flags before submitting.</p>
                            <button
                                onClick={() => setShowConfirmSubmit(true)}
                                className="w-full py-3 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all shadow-sm flex justify-center items-center"
                            >
                                Submit Full Quiz
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showConfirmSubmit && (
                    <SubmitConfirmationModal
                        stats={stats}
                        onConfirm={handleSubmitQuiz}
                        onCancel={() => setShowConfirmSubmit(false)}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

// Component helper types
type QuestionType = {
    _id: any;
    question: string;
    type: string;
    options: any;
    correctAnswer: string;
    difficulty?: string;
    points?: number;
}

type MultiProps = {
    question?: QuestionType;
    selectedAnswer: string | unknown;
    onAnswerChange: (e: string) => void;
}

const MultipleChoice = ({ question, selectedAnswer, onAnswerChange }: MultiProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question?.options?.map((option: any, index: number) => {
            const isSelected = selectedAnswer === option;
            return (
                <label
                    key={index}
                    className={`
                        group relative flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                        ${isSelected
                            ? 'bg-purple-600/10 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] transform scale-[1.02]'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/10 hover:scale-[1.01]'
                        }
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 ease-in-out"></div>
                    <div className={`
                        flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                        ${isSelected ? 'border-purple-400 focus:ring-4 focus:ring-purple-500/30' : 'border-gray-500 group-hover:border-gray-400'}
                    `}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-purple-400 animate-in zoom-in duration-200" />}
                    </div>
                    <input
                        type="radio"
                        value={option}
                        checked={isSelected}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="sr-only"
                    />
                    <span className={`text-base font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {option}
                    </span>
                </label>
            )
        })}
    </div>
);

const TrueFalse = ({ question, selectedAnswer, onAnswerChange }: MultiProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {['True', 'False'].map((option) => {
            const isSelected = selectedAnswer === option;
            const isTrue = option === 'True';
            return (
                <label
                    key={option}
                    className={`
                        relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300
                        ${isSelected
                            ? isTrue 
                                ? 'bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] transform scale-[1.02]' 
                                : 'bg-rose-500/10 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] transform scale-[1.02]'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        }
                    `}
                >
                    <input
                        type="radio"
                        value={option}
                        checked={isSelected}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="sr-only"
                    />
                    <span className={`text-2xl font-bold mb-2 ${
                        isSelected ? (isTrue ? 'text-emerald-400' : 'text-rose-400') : 'text-gray-400'
                    }`}>
                        {option}
                    </span>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                            ? (isTrue ? 'border-emerald-400' : 'border-rose-400') 
                            : 'border-gray-600'
                    }`}>
                        {isSelected && <div className={`w-4 h-4 rounded-full ${isTrue ? 'bg-emerald-400' : 'bg-rose-400'} animate-in zoom-in duration-200`} />}
                    </div>
                </label>
            )
        })}
    </div>
);

const FillBlank = ({ selectedAnswer, onAnswerChange }: Omit<MultiProps, 'question'>) => (
    <div className="max-w-2xl group">
        <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-purple-400 transition-colors">Your Answer</label>
        <div className="relative">
            <input
                type="text"
                value={(selectedAnswer as string) || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-5 py-4 bg-black/40 border-2 border-white/10 text-white rounded-xl focus:ring-0 focus:outline-none focus:border-purple-500 transition-all text-lg placeholder-gray-600 shadow-inner"
            />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300 rounded-b-xl"></div>
        </div>
    </div>
);

const SubmitConfirmationModal = ({ stats, onConfirm, onCancel, isLoading }: any) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
        <div className="bg-[#1a1a24] border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className={`p-6 text-center ${stats.total - stats.answered > 0 ? 'bg-amber-500/10' : 'bg-purple-500/10'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${stats.total - stats.answered > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Submit Quiz?</h3>
            </div>

            <div className="p-6">
                <p className="text-gray-300 text-center mb-6">
                    You won't be able to change your answers after submission. Are you absolutely sure?
                </p>

                <div className="bg-black/30 rounded-2xl p-5 space-y-3 mb-6 border border-white/5">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium">Total Questions</span>
                        <span className="text-xl font-bold text-white">{stats.total}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                        <span className="text-gray-400 font-medium flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div> Answered</span>
                        <span className="text-xl font-bold text-emerald-400">{stats.answered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium flex items-center"><div className="w-2 h-2 rounded-full bg-rose-400 mr-2"></div> Unanswered</span>
                        <span className="text-xl font-bold text-rose-400">{stats.total - stats.answered}</span>
                    </div>
                </div>

                {stats.total - stats.answered > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-300 leading-relaxed">
                            <strong className="block text-amber-400 mb-1">Warning!</strong> 
                            You have <span className="font-bold">{stats.total - stats.answered}</span> unanswered questions that will be marked as incorrect.
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-colors disabled:opacity-50"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-transparent rounded-xl font-bold text-white transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Confirm Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
