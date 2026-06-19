import { Mail } from "lucide-react";
import PasswordInput from "../passwordInput";
import { Button } from "@/shared/components/ui/button";
import CustomInput from "@/shared/components/customInput";

export default function LoginForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-1.5 text-right">
        <h2 className="text-[22px] font-bold leading-[1.3] text-[var(--landing-text)] sm:text-[24px]">
          ورود به Chess.ir
        </h2>
        <p className="text-[13px] text-[var(--landing-muted)]">
          برای ادامه، اطلاعات حساب خود را وارد کنید.
        </p>
      </div>

      <div className="space-y-3">
        <CustomInput
          id="login-email"
          type="email"
          label="ایمیل"
          placeholder="example@gmail.com"
          icon={<Mail className="size-[22px]" />}
        />
        <PasswordInput
          id="login-password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
        />
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-[10px] bg-[var(--landing-text)] text-sm font-semibold text-white hover:bg-[color:rgba(36,38,43,0.92)]"
      >
        ورود به حساب کاربری
      </Button>
    </form>
  );
}
