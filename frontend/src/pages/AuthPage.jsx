import { SignIn, SignUp } from "@clerk/clerk-react";

export default function AuthPage({ mode }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, padding: 16, background: "linear-gradient(135deg,#f5f3ff,#e0f2fe)" }}>
      <img src="/hershieldlogo.png" alt="HerShield" style={{ height: 72 }} />
      {mode === "in" ? (
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
      ) : (
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
      )}
    </div>
  );
}
