"use client";

import { z } from "zod";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PasswordInput from "../passwordInput";
import CustomInput from "@/shared/components/customInput";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/contexts/auth-provider";
import { getErrorMessage } from "@/shared/lib/http";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";

const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره همراه باید با 09 شروع شود و 11 رقم باشد."),
  password: z.string().min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toast.success("ورود با موفقیت انجام شد.");
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "ورود انجام نشد."));
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
          ورود به Chess.ir
        </h2>
        <p className="text-[13px] text-[var(--landing-muted)]">
          برای ادامه، اطلاعات حساب خود را وارد کنید.
        </p>
      </div>

      <div className="space-y-3">
        <Field data-invalid={Boolean(form.formState.errors.phone)}>
          <FieldLabel
            htmlFor="login-phone"
            className="text-[13px] font-medium text-[var(--landing-text)]"
          >
            شماره همراه
          </FieldLabel>
          <FieldContent>
            <CustomInput
              id="login-phone"
              type="tel"
              inputMode="numeric"
              placeholder="شماره موبایل خود را وارد کنید"
              icon={<Phone className="size-[22px]" />}
              aria-invalid={Boolean(form.formState.errors.phone)}
              {...form.register("phone")}
            />
          </FieldContent>
          <FieldError>{form.formState.errors.phone?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <FieldLabel
            htmlFor="login-password"
            className="text-[13px] font-medium text-[var(--landing-text)]"
          >
            رمز عبور
          </FieldLabel>
          <FieldContent>
            <PasswordInput
              id="login-password"
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
        {form.formState.isSubmitting ? "در حال ورود..." : "ورود به حساب کاربری"}
      </Button>
    </form>
  );
}
