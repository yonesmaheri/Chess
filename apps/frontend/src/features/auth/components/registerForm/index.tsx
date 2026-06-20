"use client";

import { z } from "zod";
import { Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PasswordInput from "../passwordInput";
import CustomInput from "@/shared/components/customInput";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { getErrorMessage } from "@/shared/lib/http";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";

const registerSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل 2 کاراکتر باشد."),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد."),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره همراه باید با 09 شروع شود و 11 رقم باشد."),
  password: z.string().min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data);
      toast.success("حساب کاربری با موفقیت ساخته شد.");
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "ثبت نام انجام نشد."));
    }
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1.5 text-right">
        <h2 className="text-[22px] font-bold leading-[1.3] text-[var(--landing-text)] sm:text-[24px]">
          عضویت در Chess.ir
        </h2>
        <p className="text-[13px] text-[var(--landing-muted)]">
          برای شروع، اطلاعات خود را وارد کنید.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.firstName)}>
            <FieldLabel
              htmlFor="register-first-name"
              className="text-[13px] font-medium text-[var(--landing-text)]"
            >
              نام
            </FieldLabel>
            <FieldContent>
              <CustomInput
                id="register-first-name"
                placeholder="نام خود را وارد کنید"
                icon={<UserRound className="size-[22px]" />}
                aria-invalid={Boolean(form.formState.errors.firstName)}
                {...form.register("firstName")}
              />
            </FieldContent>
            <FieldError>{form.formState.errors.firstName?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.lastName)}>
            <FieldLabel
              htmlFor="register-last-name"
              className="text-[13px] font-medium text-[var(--landing-text)]"
            >
              نام خانوادگی
            </FieldLabel>
            <FieldContent>
              <CustomInput
                id="register-last-name"
                placeholder="نام خانوادگی خود را وارد کنید"
                icon={<UserRound className="size-[22px]" />}
                aria-invalid={Boolean(form.formState.errors.lastName)}
                {...form.register("lastName")}
              />
            </FieldContent>
            <FieldError>{form.formState.errors.lastName?.message}</FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(form.formState.errors.phone)}>
          <FieldLabel
            htmlFor="register-phone"
            className="text-[13px] font-medium text-[var(--landing-text)]"
          >
            شماره همراه
          </FieldLabel>
          <FieldContent>
            <CustomInput
              id="register-phone"
              type="tel"
              inputMode="numeric"
              placeholder="شماره همراه خود را وارد کنید"
              icon={<Phone className="size-[22px]" />}
              aria-invalid={Boolean(form.formState.errors.phone)}
              {...form.register("phone")}
            />
          </FieldContent>
          <FieldError>{form.formState.errors.phone?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <FieldLabel
            htmlFor="register-password"
            className="text-[13px] font-medium text-[var(--landing-text)]"
          >
            رمز عبور
          </FieldLabel>
          <FieldContent>
            <PasswordInput
              id="register-password"
              placeholder="رمز عبور خود را وارد کنید"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
          </FieldContent>
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-12 w-full rounded-[10px] bg-[var(--landing-text)] text-sm font-semibold text-white hover:bg-[color:rgba(36,38,43,0.92)]"
      >
        {form.formState.isSubmitting ? "در حال ثبت نام..." : "ثبت نام"}
      </Button>
    </form>
  );
}
