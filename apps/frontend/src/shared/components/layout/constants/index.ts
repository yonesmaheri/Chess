import type { LucideIcon } from "lucide-react";
import { BookOpen, Globe2, Send, Target, Users } from "lucide-react";

export const containerClassName =
  "mx-auto w-full max-w-[1360px] px-5 sm:px-6 lg:px-8";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: string[];
};

export type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems = [
  { label: "خانه", href: "/" },
  { label: "بازی آنلاین", href: "/lobby" },
  { label: "رده بندی", href: "/leaderboard" },
  { label: "آموزش", href: "/dashboard/lessons" },
  { label: "درس ها", href: "/courses" },
  { label: "درباره ما", href: "/about" },
];

export const features: Feature[] = [
  {
    icon: Users,
    title: "جامعه پویا",
    description:
      "با بازیکنان هم سطح و حرفه ای ارتباط بگیرید، بازی کنید و از تجربه جمعی جامعه شطرنج یاد بگیرید.",
    href: "#community",
  },
  {
    icon: BookOpen,
    title: "درس های هدفمند",
    description:
      "از درس های مرحله به مرحله برای شروع، تثبیت تاکتیک ها و بهبود درک استراتژیک استفاده کنید.",
    href: "#features",
  },
  {
    icon: Target,
    title: "تمرین و تحلیل",
    description:
      "پازل های روزانه، تمرین های شخصی سازی شده و تحلیل بازی ها به شما کمک می کند سریع تر پیشرفت کنید.",
    href: "#stats",
  },
  {
    icon: Globe2,
    title: "بازی آنلاین",
    description:
      "در هر زمان با حریفان واقعی بازی کنید، عملکرد خود را بسنجید و با ریتمی هوشمندانه تر رشد کنید.",
    href: "#cta",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "محصولات",
    links: ["بازی آنلاین", "تمرین و تحلیل", "درس های شطرنج"],
  },
  {
    title: "شرکت",
    links: ["درباره ما", "تماس با ما", "فرصت های شغلی"],
  },
  {
    title: "جامعه",
    links: ["انجمن ها", "باشگاه ها", "بازیکنان برتر"],
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "Telegram",
    href: "https://telegram.org",
    icon: Send,
  },
];
