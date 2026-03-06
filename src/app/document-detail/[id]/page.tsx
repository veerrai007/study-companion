'use client'
import { documentSchema } from '@/models/Document'
import ApiResponse from '@/types/ApiResponse'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InferSchemaType } from "mongoose";
import GenerateQuiz from '@/components/QuizModal'


export default function page() {

    type DocumentType = InferSchemaType<typeof documentSchema>
    const param = useParams()
    const id = param.id?.toString() || "";
    const [documentt, setDocument] = useState<DocumentType>()

    const fetchAll = async () => {
        const res = await fetch(`http://localhost:3000/api/document-detail?id=${param.id}`, {
            method: "GET",
        })
        const result: ApiResponse = await res.json()
        const doc = result?.data?.documentt

        if (typeof (doc) == 'object') {
            setDocument(doc)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [])


    return (
        <div className='flex flex-col items-center justify-start min-h-screen min-w-full'>
            <h1 className='bg-red-100 font-normal text-lg rounded-lg p-3 m-3'>{documentt?.subject}: {documentt?.topic}</h1>
            <div className='bg-red-200 rounded-xl p-3'>
                <h2>Key Points</h2>
                <ul className='m-3'>
                    {documentt?.keyPoints.map((e) => {
                        return <li key={e}>{`--> ${e}`}</li>
                    })}
                </ul>
            </div>
            <div className='bg-red-300 rounded-xl p-3 m-3'>
                <h2>Topics</h2>
                <ul className='m-3'>
                    {documentt?.topics.map((e) => {
                        return <li key={e}>{`--> ${e}`}</li>
                    })}
                </ul>
            </div>
            <GenerateQuiz id={id}/>
        </div>
    )
}
