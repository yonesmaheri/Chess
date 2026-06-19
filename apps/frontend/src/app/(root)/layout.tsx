import Layout from "@/shared/components/layout";
import { ReactNode } from "react";

function WebsiteLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default WebsiteLayout;
