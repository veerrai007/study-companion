import mongoose from "mongoose";

export const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    filePath: {
        type: String,
        required: true
    },
    originalFileName: String,
    fileType: {
        type: String,
        enum: ['pdf', 'txt', 'docx', 'image'],
        required: true
    },
    summery: {
        type: String
    },
    keyPoints: {
        type: [String]
    },
    topics: {
        type: [String]
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    studyTime: {
        type: Number,
        default: 0
    },
    accessCount: {
        type: Number,
        default: 0
    },
    lastAccessed: Date,
    isProcessed: {
        type: Boolean,
        default: false
    },
    processingError: String,
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    flashcards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard'
    }],
})

const DocumentModel = mongoose.models.Document || mongoose.model('Document', documentSchema)

export default DocumentModel;