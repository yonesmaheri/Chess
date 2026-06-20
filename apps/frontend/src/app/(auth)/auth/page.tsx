import { AuthPageFeature } from "@/features/auth";
import { redirectAuthenticatedUser } from "@/services/auth-server";

export default async function AuthPage() {
  await redirectAuthenticatedUser();

  return <AuthPageFeature />;
}
