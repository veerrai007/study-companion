'use client'
import { quizSchema } from "@/models/Quiz";
import ApiResponse, { PaginationType } from "@/types/ApiResponse";
import { BarChart3, BookOpen, Brain, Calendar, Clock, Filter, Play, Plus, Search, Target } from "lucide-react";
import { InferSchemaType } from "mongoose";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {

    type QuizType = InferSchemaType<typeof quizSchema>

    const param = useParams()
    const id = param.id?.toString() || "";

    const [isLoading, setisLoading] = useState(false);
    const [quizzes, setQuizzes] = useState<QuizType[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationType>()

    const fetchAll = async () => {
        setisLoading(true)
        const res = await fetch(`/api/quiz/get-all`, {
            method: "POST",
            headers: {
                contentType: 'application/json'
            },
            body: JSON.stringify({
                page: currentPage,
                limit: 12,
                subject: selectedSubject,
                documentId: id
            })
        })
        const result: ApiResponse = await res.json()
        const quizArray = result?.data?.quizzes
        console.log(quizArray);
        const paginationData = result?.data?.pagination
        console.log(paginationData);
        setisLoading(false)
        //@ts-ignore
        setQuizzes(quizArray)
        setPagination(paginationData)
    }

    useEffect(() => {
        fetchAll();
    }, [])

    //@ts-ignore
    const subjects = [...new Set(quizzes.map(quiz => quiz.subject).filter(Boolean))];

    return (
        <div className="space-y-6 min-w-full min-h-screen p-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">Quizzes</h1>
                    <p className="text-black mt-1">Test your knowledge with AI-generated quizzes</p>
                </div>
                <Link
                    href="/documentPage"
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-red bg-white hover:bg-gray-300 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quiz
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-gray-200 rounded-lg shadow-sm p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search quizzes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 text-white bg-black w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Subject Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-900" />
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="border border-gray-300 bg-black  rounded-lg px-3 text-white py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(subject => (
                                    <option key={subject} value={subject || ''}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 bg-black text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="createdAt">Newest First</option>
                            <option value="-createdAt">Oldest First</option>
                            <option value="topic">topic A-Z</option>
                            <option value="bestScore">Best Score</option>
                            <option value="totalAttempts">Most Attempted</option>
                        </select>
                    </div>
                </div>
            </div>
    
            {/* Quizzes Grid */}
            {quizzes?.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            //@ts-ignore
                            quizzes.map((quiz) => (
                                //@ts-ignore
                                <QuizCard key={quiz._id} quiz={quiz} />
                            ))}
                    </div>

                    {/* Pagination */}
                    {
                        //@ts-ignore
                        pagination?.total > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: Math.min(5, pagination?.total || 0) }, (_, i) => {
                                    const page = i + Math.max(1, currentPage - 2);
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                                                ? 'text-white bg-purple-600'
                                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(Math.min(pagination?.total || 0, currentPage + 1))}
                                    disabled={currentPage === pagination?.total}
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    )
}

// Quiz Card Component
const QuizCard = ({ quiz }: any) => {

    const hasAttempts = quiz.totalAttempts > 0;
    const latestAttempt = quiz.attempts?.[quiz?.attempts?.length - 1];

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-yellow-600 bg-yellow-100';
        if (score >= 60) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.topic}</h3>
                        <p className="text-sm text-gray-600">{quiz.document?.topic}</p>
                        <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {quiz.subject}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Brain className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <BookOpen className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold text-gray-900">{quiz?.questions?.length || 0}</div>
                        <div className="text-xs text-gray-600">Questions</div>
                    </div>

                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Target className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                        <div className="text-lg font-semibold text-gray-900">{quiz.totalAttempts}</div>
                        <div className="text-xs text-gray-600">Attempts</div>
                    </div>
                </div>

                {/* Performance */}
                {hasAttempts && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Best Score</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(quiz.bestScore)}`}>
                                {quiz.bestScore}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${quiz.bestScore >= 80 ? 'bg-green-500' :
                                    quiz.bestScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${quiz.bestScore}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>Avg: {quiz.averageScore}%</span>
                            <span>
                                Last: {new Date(latestAttempt?.completedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                    <Link
                        href={`/quiz-take/${quiz._id}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        {hasAttempts ? 'Retake' : 'Start'} Quiz
                    </Link>

                    {/* {hasAttempts && (
                        <Link
                            href={`/quiz-results/${quiz._id}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <BarChart3 className="h-4 w-4" />
                        </Link>
                    )} */}
                </div>

                {/* Created Date */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                        {quiz.settings?.timeLimit && (
                            <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {quiz.settings.timeLimit} min
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Empty State Component
const EmptyState = () => (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
        <p className="text-gray-600 mb-6">
            Upload documents to generate AI-powered quizzes and test your knowledge
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Link
                href="/documentPage"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
            </Link>
            <Link
                href="/documentPage"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Documents
            </Link>
        </div>
    </div>
);
