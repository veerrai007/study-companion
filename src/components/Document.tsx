'use client'
import { Button } from "@/components/ui/button"
import { redirect,usePathname } from 'next/navigation'
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

interface documentProps{
  topic:string,
  summery:string,
  id:string
}

export default function Document({topic,summery,id}:documentProps) {

  const pathName = usePathname();

  return (
    <Card className="relative my-3 mx-auto w-full max-w-sm pt-0">
      <p className="text-wrap p-6 relative z-20  w-full object-cover brightness-60 grayscale dark:brightness-40 ">{summery}</p>
      <CardHeader>
        <h3 className="font-medium m-0">{"Topic: "+topic}</h3>
        <CardAction>
        <Button variant={"mystyle"}>Delete</Button>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button onClick={()=>{redirect(`/document-detail/${id}`)}} className="w-full">View</Button>
      </CardFooter>
    </Card>
  )
}
