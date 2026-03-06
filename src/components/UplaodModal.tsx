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
import ApiResponse from "@/types/ApiResponse"
import { useState } from "react"
import { toast } from "sonner"


export default function UploadModal() {

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof UploadDocumentSchema>>({
    resolver: zodResolver(UploadDocumentSchema),
    defaultValues: {
      topic: "",
      subject: ""
    },
  })

  async function onSubmit(data: z.infer<typeof UploadDocumentSchema>) {

    const formData = new FormData()
    formData.append("title", data.topic)
    formData.append("subject", data.subject)
    formData.append('document', data.document)

    try {
      const res = await fetch('http://localhost:3000/api/upload', {
        headers: {
          contentType: 'application/json'
        },
        method: 'POST',
        body: formData
      })
      const result: ApiResponse = await res.json()
      if (result.success) {
        toast.success(result.message,{richColors: true, position: 'top-center'})
      }else{
        toast.warning(result.message,{description:"Please try again",richColors: true, position: 'top-center'})
      }
    }
    catch (error: any) {
      toast.error('Something went wrong!', { description: error?.message, richColors: true, position: 'top-center' })
    }
    finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="upload-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} variant="outline">Upload Document</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
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

