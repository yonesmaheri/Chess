import { AuthPageFeature } from "@/features/auth";
import { redirectAuthenticatedUser } from "@/shared/api/services/auth/auth-server";

export default async function AuthPage() {
  await redirectAuthenticatedUser();

  return <AuthPageFeature />;
}
