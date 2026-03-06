'use client'
import Document from '@/components/Document'
import UploadModal from '@/components/UplaodModal'
import ApiResponse from '@/types/ApiResponse'
import { useEffect, useState } from 'react'
import documentSchema from "@/models/Document"

export default function page() {

  const [documents,setDocuments] = useState<typeof documentSchema[]>([])


  const fetchAll = async () => {
    const res = await fetch("http://localhost:3000/api/get-documents", {
      method: "GET",
      headers: {
        contentType: 'application/json'
      },
    })
    const result: ApiResponse = await res.json()
    const documents= result?.data?.documents
    if (documents) {
      setDocuments(documents)
    }
  }
  

  useEffect(() => {

    fetchAll();

  }, [])


  return (
    <div>
      <UploadModal />
      <div className='flex flex-row flex-wrap'>
        {
          documents.map((element:any)=>{
            return <Document key={element._id} id={element._id} summery={element.summery} topic={element.topic}/>
          })
        }
      </div>
    </div>
  )
}
