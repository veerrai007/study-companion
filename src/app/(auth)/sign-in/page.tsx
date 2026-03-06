'use client'
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { loginSchema } from '@/schema/loginSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function page() {


  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "sample@gmail.com",
      password: "123456"
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {

    try {
      setLoading(true);
      const res = await signIn('credentials', {
        redirect: false,
        email:data.email,
        password:data.password
      })      
      setLoading(false);

      if (res?.error) {
        toast.warning(res?.error, { position: "top-center", richColors: true })
      }

      else {
        toast.success("Succesfully Login!", { position: "top-center", richColors: true })
        router.push('/dashboard')
      }

    } catch (error: any) {
      toast.error("Something went wrong!", { description: "Please ary again after some time!", position: "top-center", richColors: true })
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen min-w-full'>
      <form className='min-w-1/6' id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-form-title">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="signup-form-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your Email"
                  autoComplete="off"
                />
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
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-form-title">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  id="signup-form-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Set a password"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Button className='m-3' type="submit" form="signup-form">
        {loading && <Spinner />}
        Login
      </Button>
    </div>
  )
}
