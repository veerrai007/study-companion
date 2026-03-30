'use client'
import { documentSchema } from '@/models/Document'
import ApiResponse from '@/types/ApiResponse'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InferSchemaType } from "mongoose";
import GenerateQuiz from '@/components/QuizModal'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Activity, Eye, FileText, CheckCircle2, Hash, BrainCircuit } from 'lucide-react'

export default function DocumentDetailPage() {

    type DocumentType = InferSchemaType<typeof documentSchema>
    const param = useParams()
    const id = param.id?.toString() || "";
    const [documentt, setDocument] = useState<DocumentType>()
    const [loading, setLoading] = useState(true)

    const fetchAll = async () => {
        try {
            const res = await fetch(`/api/document-detail?id=${param.id}`, {
                method: "GET",
            })
            const result: ApiResponse = await res.json()
            const doc = result?.data?.documentt

            if (doc && typeof (doc) === 'object') {
                setDocument(doc as DocumentType)
            }
        } catch (error) {
            console.error("Error fetching document details:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [param.id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!documentt) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl font-semibold text-gray-500">Document not found</h2>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 min-h-screen animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-medium">
                    <BookOpen className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">{documentt.subject}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    {documentt.topic}
                </h1>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span className="capitalize text-sm font-medium">
                            {documentt.difficulty || 'Intermediate'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {documentt.studyTime || 0} mins study time
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {documentt.accessCount || 0} views
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <BrainCircuit className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {documentt.quizzes?.length || 0} Quizzes
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-8">
                    {/* Summary */}
                    {documentt.summary && (
                        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <FileText className="w-6 h-6 text-primary" />
                                    Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    {documentt.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Key Points */}
                    {documentt.keyPoints && documentt.keyPoints.length > 0 && (
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    Key Points
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {documentt.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex gap-3 items-start bg-secondary/30 p-4 rounded-lg">
                                            <div className="mt-1 bg-primary/20 p-1 rounded-full text-primary shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                            <span className="text-foreground leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Actions */}
                    <Card className="border-primary/20 shadow-lg bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-xl">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <GenerateQuiz id={id} />
                            <Link href={`/quizzes/${id}`} className="w-full">
                                <Button className="w-full bg-background text-primary border-primary hover:bg-primary/10" variant="outline" size="lg">
                                    <BrainCircuit className="w-4 h-4 mr-2" />
                                    View Quizzes
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Topics */}
                    {documentt.topics && documentt.topics.length > 0 && (
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Hash className="w-5 h-5 text-purple-500" />
                                    Topics Covered
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {documentt.topics.map((topic, idx) => (
                                        <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200">
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
