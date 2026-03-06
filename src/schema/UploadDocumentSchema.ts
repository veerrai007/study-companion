import * as z from 'zod'

export const UploadDocumentSchema = z.object({

    topic: z.string().min(3, "Topic must be at least 3 characters long"),
    subject: z.string().min(3,"Subject must be at least 3 characters long"),
    document: z.file("Documentsss is required")
})