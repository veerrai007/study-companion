import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { FieldGroup } from "./ui/field"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
    id: string
}

export default function GenerateQuiz({ id }: Props) {

    const [open, setOpen] = useState(false);
    const [count, setCount] = useState("5");
    const [difficulty, setDifficulty] = useState("easy");

    async function onSubmit() {

        setOpen(false);
        const formData = new FormData()
        formData.append("documentId", id)
        formData.append("questionCount", count)
        formData.append('difficulty', difficulty)

        toast.promise(
            () => new Promise<{ value: string }>(async (resolve, reject) => {
                try {
                    const res = await fetch('http://localhost:3000/api/generate-quiz', {
                        method: 'POST',
                        body: formData
                    })
                    const result = await res.json();
                    if (result.success) {
                        resolve({ value: result.message })
                    } else {
                        reject({ value: result.message })
                    }
                } catch (error: any) {
                    reject({ value: `Error: Bad Request!` })
                }
            }),
            {
                loading: "Generating Quiz...",
                success: data => `${data?.value}`,
                error: data => `${data?.value}`,
                position: "top-right"
            }
        )
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <form id="upload-form">
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)} variant="outline">Generate Quiz</Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined} className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Generate Quiz</DialogTitle>
                        </DialogHeader>
                        <FieldGroup>
                            <Select onValueChange={(e) => { setCount(e) }}>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Number of Questions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup >
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(e) => { setDifficulty(e) }}>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Difficulty Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={onSubmit} >Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )
}

