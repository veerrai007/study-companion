'use client'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ApiResponse from '@/types/ApiResponse';
import { quizSchema } from '@/models/Quiz';
import { InferSchemaType } from 'mongoose';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Flag, Pause, Play } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { QuizContext } from '@/context/quizContext';


export default function page() {

    const {setResult} = useContext(QuizContext);

    const router = useRouter();

    const param = useParams()
    const id = param.id?.toString() || "";

    type QuizType = InferSchemaType<typeof quizSchema>

    const [quiz, setQuiz] = useState<QuizType>()
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizStartTime, setQuizStartTime] = useState<number>();
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [quizPaused, setQuizPaused] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const fetchAll = async () => {
        setisLoading(true)
        const res = await fetch(`http://localhost:3000/api/quiz/get-single?id=${id}`, {
            method: "GET",
        })
        const result: ApiResponse = await res.json()
        const quizData = result?.data?.quiz
        setisLoading(false)

        if (typeof (quizData) == 'object') {
            //@ts-ignore
            setQuiz(quizData)
        }
    }

    const handleSubmitQuiz = async () => {
        const timeSpent = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;
        // @ts-ignore
        const answerArray = quiz.questions.map((_, index) => answers[index] || '');
        setisLoading(true)
        const res = await fetch(`http://localhost:3000/api/quiz/submit?id=${id}`, {
            method: "POST",
            headers: {
                contentType: 'application/json'
            },
            body: JSON.stringify({ answers: answerArray, timeSpent })
        })
        const result: ApiResponse = await res.json()
        setResult(result?.data?.result)
        console.log(result?.data?.result);
        router.push(`/quiz-results/${id}`)
    }

    const handlePauseResume = () => {
        if (quizPaused) {
            setQuizPaused(false);
        } else {
            setQuizPaused(true);
        }
    };

    // Start quiz
    const handleStartQuiz = () => {
        setQuizStarted(true);
        const now = Date.now();
        setQuizStartTime(now);
    };

    // Handle answer selection
    const handleAnswerChange = (questionIndex: any, answer: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    // Navigate questions
    const goToQuestion = (index: any) => {
        setCurrentQuestion(index);
    };

    const goToNextQuestion = () => {
        //@ts-ignore
        if (currentQuestion < quiz?.questions?.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // Get completion stats
    const getCompletionStats = () => {
        const answered = Object.keys(answers).length;
        const total = quiz?.questions?.length || 0;
        return { answered, total };
    };

    useEffect(() => {
        fetchAll()
    }, [])

    if (!quizStarted) {
        return (
            <div className='bg-gray-600 min-h-screen min-w-full flex flex-row justify-items-center items-center'>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="bg-purple-100 p-4 rounded-full">
                                    <Brain className="h-12 w-12 text-purple-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz?.topic}</h1>
                            <p className="text-gray-600">Ready to test your knowledge?</p>
                        </div>

                        {/* Quiz Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                                    <span className="font-medium text-gray-900">Questions</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{quiz?.questions.length}</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Read each question carefully before answering</li>
                                <li>• You can navigate between questions and change your answers</li>
                                <li>• Use the flag feature to mark questions for review</li>
                                <li>• Click "Submit Quiz" when you're finished</li>
                            </ul>
                        </div>

                        {/* Start Button */}
                        <div className="text-center">
                            <button
                                onClick={handleStartQuiz}
                                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = quiz?.questions[currentQuestion];
    const stats = getCompletionStats();
    const progress = (stats.answered / stats.total) * 100;

    return (
        <div className='bg-gray-600 min-h-screen min-w-screen flex flex-row justify-items-center items-center'>
            <div className="max-w-4xl bg-black p-4 rounded-lg  mx-auto">
                {/* Quiz Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <button
                                // onClick={() => navigate('/quizzes')}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-3"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">{quiz?.topic}</h1>
                                <p className="text-sm text-gray-500">
                                    Question {currentQuestion + 1} of {quiz?.questions.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Pause/Resume */}
                            <button
                                onClick={handlePauseResume}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                title={quizPaused ? 'Resume Quiz' : 'Pause Quiz'}
                            >
                                {quizPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-600">
                                {stats.answered}/{stats.total} answered
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Paused Overlay */}
                {quizPaused && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                            <Pause className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Paused</h2>
                            <p className="text-gray-600 mb-6">Click resume when you're ready to continue</p>
                            <button
                                onClick={handlePauseResume}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Resume Quiz
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* Question Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Question {currentQuestion + 1}
                                        </span>
                                        {currentQ?.difficulty && (
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {currentQ.difficulty}
                                            </span>
                                        )}
                                        <span className="ml-auto text-sm text-gray-500">
                                            {currentQ?.points} {currentQ?.points === 1 ? 'point' : 'points'}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                                        {currentQ?.question}
                                    </h2>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="space-y-4">
                                {currentQ?.type === 'multiple-choice' && (
                                    <MultipleChoice
                                        question={currentQ}
                                        //@ts-ignore
                                        selectedAnswer={answers[currentQuestion]}
                                        onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                    />
                                )}

                                {currentQ?.type === 'true-false' && (
                                    <TrueFalse
                                        question={currentQ}
                                        //@ts-ignore
                                        selectedAnswer={answers[currentQuestion]}
                                        onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                    />
                                )}

                                {currentQ?.type === 'fill-in-the-blank' && (
                                    <FillBlank
                                        question={currentQ}
                                        //@ts-ignore
                                        selectedAnswer={answers[currentQuestion]}
                                        onAnswerChange={(answer) => handleAnswerChange(currentQuestion, answer)}
                                    />
                                )}

                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={goToPreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </button>

                                <div className="flex space-x-3">
                                    {
                                        //@ts-ignore
                                        currentQuestion === quiz?.questions?.length - 1 ? (
                                            <button
                                                onClick={() => setShowConfirmSubmit(true)}
                                                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Submit Quiz
                                            </button>
                                        ) : (
                                            <button
                                                onClick={goToNextQuestion}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                Next
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quiz Overview */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Quiz Overview</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Questions:</span>
                                    <span className="font-medium">{stats.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Answered:</span>
                                    <span className="font-medium text-green-600">{stats.answered}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-medium text-orange-600">{stats.total - stats.answered}</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Navigator */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
                            <div className="flex flex-row flex-wrap">
                                {
                                    //@ts-ignore
                                    quiz.questions.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToQuestion(index)}
                                            className={` m-1 w-[30px] h-[30px] rounded transition-colors ${index === currentQuestion
                                                ? 'bg-purple-600 text-white'
                                                //@ts-ignore
                                                : answers[index]
                                                    ? 'bg-green-300 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-600 text-white hover:bg-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 text-xs">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded-lg mr-1"></div>
                                    <span className="text-gray-600">Unanswered</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-300 rounded-lg mr-1"></div>
                                    <span className="text-gray-600">Answered</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Submit */}
                        <button
                            onClick={() => setShowConfirmSubmit(true)}
                            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit Quiz
                        </button>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showConfirmSubmit && (
                    <SubmitConfirmationModal
                        stats={stats}
                        onConfirm={handleSubmitQuiz}
                        onCancel={() => setShowConfirmSubmit(false)}
                    />
                )}
            </div>
        </div>
    );
};



type questiontype = {
    _id: Object,
    question: string
    type: string
    options: object,
    correctAnswer: string,
    // explanation: string,
    difficulty: string
    points: number
    // topic: string
}

type multiProps = {
    question: questiontype,
    selectedAnswer: string,
    onAnswerChange: (e: string) => void
}

// Question Type Components
const MultipleChoice = ({ question, selectedAnswer, onAnswerChange }: multiProps) => (
    <div className="space-y-3">
        {
            //@ts-ignore
            question?.options.map((option: any, index: any) => (
                <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name={`question-${question?._id}`}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-900">{option}</span>
                </label>
            ))}
    </div>
);
const TrueFalse = ({ question, selectedAnswer, onAnswerChange }: multiProps) => (
    <div className="space-y-3">
        {['True', 'False'].map((option) => (
            <label
                key={option}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">{option}</span>
            </label>
        ))}
    </div>
);
const FillBlank = ({ question, selectedAnswer, onAnswerChange }: multiProps) => (
    <div>
        <input
            type="text"
            value={selectedAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full px-4 py-3 border border-gray-300 text-black  rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
    </div>
);

// Submit Confirmation Modal
const SubmitConfirmationModal = ({ stats, onConfirm, onCancel }: any) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Submit Quiz?</h3>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Total Questions:</span>
                            <span className="font-medium">{stats.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Answered:</span>
                            <span className="font-medium text-green-600">{stats.answered}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Unanswered:</span>
                            <span className="font-medium text-orange-600">{stats.total - stats.answered}</span>
                        </div>

                    </div>

                    {stats.total - stats.answered > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> You have {stats.total - stats.answered} unanswered questions.
                                These will be marked as incorrect.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white hover:bg-gray-50 transition-colors"
                    >
                        Review Quiz
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {
                            'Submit Quiz'
                        }
                    </button>
                </div>
            </div>
        </div>
    </div>
);