import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/shared/components/providers";
import { getServerSessionUser } from "@/shared/api/services/auth/auth-server";

const vazirMatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chess.ir | یادگیری و بازی شطرنج",
  description:
    "صفحه اصلی Chess.ir برای آموزش شطرنج، بازی آنلاین، تمرین روزانه و ارتباط با جامعه بازیکنان.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getServerSessionUser();

  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirMatn.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${vazirMatn.className} min-h-full flex flex-col`}>
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  );
}
