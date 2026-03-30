'use client'
import Document from '@/components/Document'
import UploadModal from '@/components/UplaodModal'
import ApiResponse from '@/types/ApiResponse'
import { useEffect, useState } from 'react'
import documentSchema from "@/models/Document"

export default function page() {

  const [documents,setDocuments] = useState<typeof documentSchema[]>([])


  const fetchAll = async () => {
    try {
      const res = await fetch("/api/get-documents", {
        method: "GET",
        headers: {
          contentType: 'application/json'
        },
      })
      const result: ApiResponse = await res.json()
      const documentsData = result?.data?.documents
      if (documentsData) {
        setDocuments(documentsData)
      }
    } catch (e) {
      console.log("Error fetching documents",e)
    }
  }

  useEffect(() => {
    fetchAll();
  }, [])

  const handleUploadSuccess = (newDoc: any) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleProcessSuccess = (updatedDoc: any) => {
    setDocuments((prev) => 
      prev.map((doc: any) => 
        String(doc._id) === String(updatedDoc._id) 
          ? { ...doc, ...updatedDoc } 
          : doc
      )
    );
  };

  return (
    <div className="max-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-12 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-800">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              My Documents
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              Manage and analyze your study materials with ease.
            </p>
          </div>
          <div className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <UploadModal onUploadSuccess={handleUploadSuccess} text="Upload Document" style="" onProcessSuccess={handleProcessSuccess} />
          </div>
        </div>

        {/* Documents Grid view */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((element: any, index: number) => (
              <div
                key={element._id}
                className="group animate-in fade-in zoom-in-95 duration-500"
                style={{ animationFillMode: "both", animationDelay: `${index * 100}ms` }}
              >
                <div className="transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] h-full">
                  <Document
                    id={element._id}
                    summary={element.summary || "No summary available yet."}
                    topic={element.topic}
                    isProcessed={element.isProcessed}
                    processingError={element.processingError}
                    onDelete={(id) => setDocuments((prev) => prev.filter((doc: any) => doc._id !== id))}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl bg-neutral-100 dark:bg-neutral-900/50">
            <div className="text-neutral-400 dark:text-neutral-500 mb-4 animate-bounce">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-300">No documents found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">Upload your first document to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
