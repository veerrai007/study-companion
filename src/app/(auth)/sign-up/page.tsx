'use client'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from "react-hook-form"
import { signupSchema } from '@/schema/signupSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Sparkles, BookOpen, Eye, EyeOff, User } from "lucide-react"

export default function page() {

    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "Sample",
            email: "sample@gmail.com",
            password: "123456"
        },
    })

    async function onSubmit(data: z.infer<typeof signupSchema>) {        
        try {
            setLoading(true);

            const res = await fetch('/api/sign-up', {
                headers: {
                    contentType: 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
            })

            setLoading(false);
            
            if (res.status == 200) {
                toast.success(res.statusText,{description: "Please Login to your account",position:"top-center",richColors:true})
                router.push('/sign-in')
            } 
            else {                
                toast.warning(res.statusText,{position:"top-center",richColors:true})
            }

        } catch (error: any) {
            setLoading(false);
            console.log(error.message);
            toast.error("Something went wrong!",{description:"Please try again after some time!",position:"top-center",richColors:true})
        }
    }

    return (
        <div className="max-h-screen w-full flex bg-neutral-50 dark:bg-neutral-950 overflow-hidden relative">
          
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] animate-pulse duration-1000" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] animate-pulse duration-700 delay-300" />
          </div>
    
          {/* Main Content */}
          <div className="flex w-full z-10">
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative">
              <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 mb-4 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Create an account</h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Enter your details to get started
                  </p>
                </div>
    
                <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow duration-500">
                  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                      
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className="space-y-1">
                            <FieldLabel className="text-xs uppercase tracking-wider text-neutral-500 font-semibold" htmlFor="name-input">
                              Full Name
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                                <User className="w-4 h-4" />
                              </div>
                              <Input
                                {...field}
                                id="name-input"
                                aria-invalid={fieldState.invalid}
                                placeholder="John Doe"
                                autoComplete="name"
                                className="pl-10 bg-neutral-50 dark:bg-neutral-950 focus-visible:ring-indigo-500 transition-all duration-300"
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className="space-y-1 mt-4">
                            <FieldLabel className="text-xs uppercase tracking-wider text-neutral-500 font-semibold" htmlFor="email-input">
                              Email Address
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                                <Mail className="w-4 h-4" />
                              </div>
                              <Input
                                {...field}
                                id="email-input"
                                aria-invalid={fieldState.invalid}
                                placeholder="name@example.com"
                                autoComplete="email"
                                className="pl-10 bg-neutral-50 dark:bg-neutral-950 focus-visible:ring-indigo-500 transition-all duration-300"
                              />
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className="space-y-1 mt-4">
                            <FieldLabel className="text-xs uppercase tracking-wider text-neutral-500 font-semibold" htmlFor="password-input">
                              Password
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                                <Lock className="w-4 h-4" />
                              </div>
                              <Input
                                {...field}
                                id="password-input"
                                type={showPassword ? "text" : "password"}
                                aria-invalid={fieldState.invalid}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="pl-10 pr-10 bg-neutral-50 dark:bg-neutral-950 focus-visible:ring-indigo-500 transition-all duration-300"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
    
                    <div className="pt-2">
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 group transition-all" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner className="mr-2 h-4 w-4" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        )}
                        Sign Up
                      </Button>
                    </div>
                  </form>
                </div>
    
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6 animate-in fade-in duration-1000">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline transition-all">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>        
          </div>
        </div>
      )
}
