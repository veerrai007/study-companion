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
  Download,
  TrendingUp,
  Brain,
  AlertCircle,
  Award,
  Star,
  BookOpen,
  BarChart3,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Flag,
  Timer,
  Percent
} from 'lucide-react';
import { InferSchemaType } from 'mongoose';
import { quizSchema } from '@/models/Quiz';
import { useParams } from 'next/navigation';
import ApiResponse, { Question } from '@/types/ApiResponse';
import { QuizContext } from '@/context/quizContext';
import { useRouter } from 'next/navigation'

export default function QuizResults() {

  const { resultt } = useContext(QuizContext)

  const router = useRouter()

  const param = useParams()
  const id = param.id?.toString() || "";

  type QuizType = InferSchemaType<typeof quizSchema>
  const [quiz, setQuiz] = useState<QuizType>()
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const fetchResult = async () => {
    // setisLoading(true)
    const res = await fetch(`/api/quiz/result?id=${id}`, {
      method: "GET",
    })
    const result: ApiResponse = await res.json()
    const quizData = result?.data?.quiz
    // setisLoading(false)

    if (typeof (quizData) == 'object') {
      //@ts-ignore
      setQuiz(quizData)
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
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
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
    if (percentage >= 95) return { message: "Outstanding! Perfect performance! 🎉", icon: "🏆", color: "text-green-600" };
    if (percentage >= 85) return { message: "Excellent work! You've mastered this topic! ⭐", icon: "🌟", color: "text-green-600" };
    if (percentage >= 75) return { message: "Good job! You have a solid understanding! 👍", icon: "👍", color: "text-blue-600" };
    if (percentage >= 65) return { message: "Not bad! Some areas need review. 📖", icon: "📚", color: "text-yellow-600" };
    if (percentage >= 50) return { message: "Keep studying! You'll get there! 💪", icon: "💪", color: "text-orange-600" };
    return { message: "Don't give up! Review and try again! 🚀", icon: "📖", color: "text-red-600" };
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

  const { score, timeSpent, feedback, questions } = resultt
  const performance = getPerformanceMessage(score.percentage);
  const topicPerformance = calculateTopicPerformance();

  return (
    <>
      <div className='bg-gray-600 min-h-screen min-w-screen flex flex-row justify-items-center items-center'>
        <div className="max-w-4xl my-3 mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push(`/quizzes/${quiz?.document}`)}
                className="flex items-center text-black hover:text-gray-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Quizzes
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/quiz-take/${id}`)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </button>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-black bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </button>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz?.topic || 'Quiz Results'}</h1>
              <p className="text-gray-600">Here's how you performed!</p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${score.percentage >= 80 ? 'bg-green-100' :
                score.percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                {score.percentage >= 80 ? (
                  <Trophy className="h-12 w-12 text-green-600" />
                ) : score.percentage >= 60 ? (
                  <Target className="h-12 w-12 text-yellow-600" />
                ) : (
                  <Brain className="h-12 w-12 text-red-600" />
                )}
              </div>

              <div className={`text-5xl font-bold mb-2 ${getScoreColor(score.percentage)}`}>
                {score.percentage}%
              </div>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${score.percentage >= 80 ? 'bg-green-100 text-green-800' :
                  score.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {getScoreGrade(score.percentage)}
                </div>
                <div className="text-gray-600">
                  {score.correct} / {score.total} correct
                </div>
              </div>

              <div className={`text-lg ${performance.color} mb-2`}>
                {performance.message}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent || 0)}</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          {feedback && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">AI Feedback</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 leading-relaxed">{feedback}</p>
              </div>
            </div>
          )}

          {/* Topic Performance */}
          {topicPerformance.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Performance by Topic</h2>
              </div>

              <div className="space-y-4">
                {topicPerformance.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{topic.topic}</h3>
                      <span className={`font-bold ${getScoreColor(topic.percentage)}`}>
                        {topic.percentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {topic.correct} / {topic.total} correct
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${topic.percentage >= 80 ? 'bg-green-500' :
                          topic.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Question Review</h2>
              </div>
              <div className="text-sm text-gray-600">
                Click on questions to see explanations
              </div>
            </div>

            <div className="space-y-4">
              {questions?.map((question: string, index: any) => (
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => router.push(`/quiz-take/${id}`)}
                className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Quiz Again
              </button>

              {/* <Link
            to="/quizzes"
            className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Brain className="h-4 w-4 mr-2" />
            Browse More Quizzes
          </Link> */}

              {/* <Link
            to="/progress"
            className="flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Progress
          </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Question Review Component
const QuestionReview = ({ question, index, isExpanded, onToggle }: any) => {
  const isCorrect = question.isCorrect;

  return (
    <div className={`border rounded-lg transition-colors ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}>
      <div
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-3">
                Question {index + 1}
              </span>

              {isCorrect ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Correct</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Incorrect</span>
                </div>
              )}

              {question.topic && (
                <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {question.topic}
                </span>
              )}
            </div>

            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {question.question}
            </h3>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <span>Your answer:
                <span className={`ml-1 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {question.userAnswer || 'No answer'}
                </span>
              </span>

              {!isCorrect && (
                <span>Correct answer:
                  <span className="ml-1 font-medium text-green-600">
                    {question.correctAnswer}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center ml-4">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && question.explanation && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Explanation</h4>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};