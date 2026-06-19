"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

import { CustomInput } from "./custom-input"


const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),
})


type FormValues = z.infer<typeof schema>


export default function UserForm() {

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
    },
  })


  const onSubmit = (data: FormValues) => {
    console.log(data)
  }


  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 max-w-sm"
    >

      <Field>
        <FieldLabel>
          Username
        </FieldLabel>


        <FieldContent>

          <CustomInput
            placeholder="username"

            {...form.register("username")}
          />

        </FieldContent>


        <FieldError>
          {form.formState.errors.username?.message}
        </FieldError>

      </Field>



      <Field>

        <FieldLabel>
          Email
        </FieldLabel>


        <FieldContent>

          <CustomInput
            type="email"
            placeholder="email@example.com"

            {...form.register("email")}
          />

        </FieldContent>


        <FieldError>
          {form.formState.errors.email?.message}
        </FieldError>

      </Field>



      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Submit
      </button>


    </form>
  )
}