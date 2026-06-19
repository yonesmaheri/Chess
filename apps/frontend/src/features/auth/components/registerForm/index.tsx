import { Mail, UserRound } from "lucide-react";
import PasswordInput from "../passwordInput";
import { Button } from "@/shared/components/ui/button";
import CustomInput from "@/shared/components/customInput";

export default function RegisterForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-3 text-right">
        <h2 className="text-[28px] font-bold leading-[1.4] text-[var(--landing-text)]">
          عضویت در Chess.ir
        </h2>
        <p className="text-[15px] text-[var(--landing-muted)]">
          برای شروع، اطلاعات خود را وارد کنید.
        </p>
      </div>

      <div className="space-y-6">
        <CustomInput
          id="register-name"
          label="نام کاربری"
          placeholder="نام کاربری خود را وارد کنید"
          icon={<UserRound className="size-[22px]" />}
        />
        <CustomInput
          id="register-email"
          type="email"
          label="ایمیل"
          placeholder="example@gmail.com"
          icon={<Mail className="size-[22px]" />}
        />
        <PasswordInput
          id="register-password"
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
        />
      </div>

      <Button
        type="submit"
        className="h-16 w-full rounded-[12px] bg-[var(--landing-text)] text-lg font-semibold text-white hover:bg-[color:rgba(36,38,43,0.92)]"
      >
        ثبت نام
      </Button>
    </form>
  );
}
