import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: 'AIzaSyB-aTYN0MwC8VxBh-AfJEVpI5HRbiHSsr8' });

export const analyzeDocument = async (title: string, subject: string, content: string) => {
    const prompt = `
        Analyze the following study material and provide:
        1. A concise summary (2-3 sentences)
        2. 5-7 key points or concepts
        3. Main topics covered
        4. Difficulty level : beginner or intermediate or advanced

        Title: ${title}
        Subject: ${subject}
        Content: ${content.substring(0, 1000)}...

        Respond in JSON format:
        {
          "summary": "...",
          "keyPoints": ["...", "..."],
          "topics": ["...", "..."],
          "difficulty": "intermediate"
        }
      `;
    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        const text = result.text;
        const jsonString = text?.toString().replace(/^```json\n/, '').replace(/\n```$/, '');
        if (jsonString) {
            return JSON.parse(jsonString);
        }
    } catch (error) {
        console.log(error);
        throw new Error('failed to get Ai responce:' + error)
    }
}

export const generateQuize = async (quantity: string, content: string, topic: string, difficulty: string) => {
    const prompt = `
        Create a ${quantity}-question quiz based on the following study material.
        Title: ${topic}
        Difficulty: ${difficulty}
        
        Content: ${content.substring(0, 1000)}...
        
        Generate a mix of question types:
        - 60% multiple choice (4 options each)
        - 20% true false
        - 20% fill in the blank
        
        For each question, provide:
        - The question text
        - Question type
        - Options (for multiple choice)
        - Correct answer
        - Brief explanation
        - Topic/concept it tests
        - Difficulty level (easy/medium/hard)
        
        Respond in JSON format:
        {
          "questions": [
            {
              "question": "...",
              "type": "multiple-choice",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correctAnswer": "A) ...",
              "explanation": "...",
              "topic": "...",
              "difficulty": "easy"
            }
          ]
        }
      `;
    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        const text = result.text;
        const jsonString = text?.toString().replace(/^```json\n/, '').replace(/\n```$/, '');
        if (jsonString) {
            return JSON.parse(jsonString);
        }
    } catch (error) {
        console.log(error);
        throw new Error('failed to get Ai responce:' + error)
    }
}