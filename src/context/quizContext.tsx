'use client'
import { createContext, useState } from 'react';
import { Results } from '@/types/ApiResponse';

export const QuizContext = createContext<any>(undefined);

export const QuizState = ({ children }: { children: React.ReactNode }) => {

    const [resultt,setResult] = useState<Results>()

    return (

        <QuizContext.Provider value={{resultt,setResult}}>
            {children}
        </QuizContext.Provider>

    )
}
