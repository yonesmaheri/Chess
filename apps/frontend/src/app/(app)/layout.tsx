import { ReactNode } from "react";
import Layout from "@/shared/components/layout";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
