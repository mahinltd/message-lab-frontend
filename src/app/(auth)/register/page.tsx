import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start sending SMS through your own device — free"
    >
      <RegisterForm />
    </AuthCard>
  );
}