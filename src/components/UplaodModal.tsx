'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UploadDocumentSchema } from "@/schema/UploadDocumentSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { toast } from "sonner"


interface UploadModalProps {
  onUploadSuccess?: (doc: any) => void;
  onProcessSuccess?: (doc: any) => void;
  text?: string;
  style?: string;
}

export default function UploadModal({ onUploadSuccess, onProcessSuccess, text, style }: UploadModalProps = {}) {

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof UploadDocumentSchema>>({
    resolver: zodResolver(UploadDocumentSchema),
    defaultValues: {
      topic: "",
      subject: ""
    },
  })

  async function onSubmit(data: z.infer<typeof UploadDocumentSchema>) {

    setOpen(false);
    const formData = new FormData()
    formData.append("title", data.topic)
    formData.append("subject", data.subject)
    formData.append('document', data.document)

    try {
      const uploadToastId = toast.loading("Uploading Document...", { position: "top-right" });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const result: any = await res.json()

      if (result?.success) {
        toast.success(result?.message || "Document Uploaded", { id: uploadToastId });

        if (onUploadSuccess && result.data) {
          onUploadSuccess(result.data);
        }

        // --- Start Polling for Processing Status ---
        const docId = result.data?._id;
        if (docId) {
          const processToastId = toast.loading("Processing Document...", { position: "top-right" });

          const pollInterval = setInterval(async () => {
            try {
              const statusRes = await fetch(`/api/status?id=${docId}`);
              const statusData = await statusRes.json();

              if (statusData?.data?.isProcessed) {
                clearInterval(pollInterval);
                toast.success("Document Processed Successfully!", { id: processToastId, duration: 5000 });
                if (onProcessSuccess && statusData.data.document) {
                  onProcessSuccess(statusData.data.document);
                }
              }
            } catch (err) {
              clearInterval(pollInterval);
              toast.error("Failed to check processing status.", { id: processToastId });
            }
          }, 4000); // Check every 4 seconds
        }

      } else {
        toast.error(result?.message || "Upload Failed", { id: uploadToastId });
      }
    } catch (error: any) {
      toast.error("Error: Bad Request!", { position: "top-right" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="upload-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} variant="outline" className={style}>{text}</Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Upload A Document</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="topic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="upload-form-topic">
                    Topic
                  </FieldLabel>
                  <Input
                    {...field}
                    id="upload-form-topic"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Topic Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="upload-form-subject">
                    Subject
                  </FieldLabel>
                  <Input
                    {...field}
                    id="upload-form-subject"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Subject Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="document"
              control={form.control}
              render={({ field: { onChange, onBlur, name, ref }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="document">
                    Document
                  </FieldLabel>
                  <Input
                    type="file"
                    id="document"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      const files = e.target.files;
                      onChange(files?.[0]);
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="upload-form">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

