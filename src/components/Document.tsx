'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { FileText, Loader2, CheckCircle2, AlertCircle, Trash2, Eye } from "lucide-react"

interface documentProps {
  topic: string;
  summary: string;
  id: string;
  isProcessed?: boolean;
  processingError?: string;
  onDelete?: (id: string) => void;
}

export default function Document({ topic, summary, id, isProcessed, processingError, onDelete }: documentProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/delete-document/?id=${id}`, {
      method: "DELETE"
    })
    if (res.ok) {
      toast.success("Document deleted successfully", { position: "top-center", richColors: true })
      if (onDelete) {
        onDelete(id)
      }
    } else {
      toast.error("Failed to delete document", { position: "top-center", richColors: true })
    }
  }

  // Determine status details
  let StatusIcon = Loader2;
  let statusText = "Processing...";
  let statusColor = "text-amber-500";
  let statusBg = "bg-amber-50 dark:bg-amber-500/10";
  let iconClass = "animate-spin";

  if (isProcessed) {
    StatusIcon = CheckCircle2;
    statusText = "Ready";
    statusColor = "text-emerald-500";
    statusBg = "bg-emerald-50 dark:bg-emerald-500/10";
    iconClass = "";
  } else if (processingError) {
    StatusIcon = AlertCircle;
    statusText = "Failed";
    statusColor = "text-rose-500";
    statusBg = "bg-rose-50 dark:bg-rose-500/10";
    iconClass = "";
  }

  return (
    <Card 
      className="relative flex flex-col w-full h-full overflow-hidden transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 group cursor-pointer"
      onClick={() => { router.push(`/document-detail/${id}`) }}
    >
      {/* Top decorative gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r z-20 ${
        isProcessed ? 'from-emerald-400 to-teal-500' : 
        processingError ? 'from-rose-400 to-red-500' : 
        'from-amber-400 to-orange-500 animate-pulse'
      }`} />

      <CardHeader className="pb-4 pt-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${statusBg} ${statusColor} shrink-0`}>
            <FileText size={22} className="opacity-80" />
          </div>
          <div className="overflow-hidden">
            <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {topic}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1.5">
              <StatusIcon size={14} className={`${statusColor} ${iconClass}`} />
              <span className={`text-xs font-medium ${statusColor}`}>
                {statusText}
              </span>
            </div>
          </div>
        </div>
        <CardAction>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="h-8 w-8 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 z-20 transition-colors"
          >
            <Trash2 size={16} />
            <span className="sr-only">Delete</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-grow pt-0 relative z-10 w-full">
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {summary || "Process this document to generate a comprehensive summary and extract key learning points."}
        </p>
      </CardContent>

      <CardFooter className="pt-4 pb-4 border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 relative z-10">
        <Button 
          variant="default" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all group-hover:shadow-md group-hover:shadow-indigo-500/20"
          onClick={(e) => { 
            e.stopPropagation();
            router.push(`/document-detail/${id}`);
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
