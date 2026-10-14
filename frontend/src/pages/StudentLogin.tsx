// frontend/src/pages/StudentLogin.tsx

import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, GraduationCap, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "access";

export default function StudentLogin() {
  const { student, isStudentLoading, studentLogin, studentRequestAccess } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after signing in (set by StudentRoute), default: profile
  const from = (location.state as any)?.from?.pathname || "/profile";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Already signed in -> skip the form
  if (!isStudentLoading && student) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await studentLogin(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter the email you enrolled with.");
      return;
    }

    try {
      setSubmitting(true);
      await studentRequestAccess(email.trim());
      setLinkSent(true); // same message whether or not the email exists
    } catch (err: any) {
      toast.error(err.message || "Could not send the link");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setLinkSent(false);
    setPassword("");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EBE0]">
            <GraduationCap className="h-6 w-6 text-[#B88A2A]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#222222]">
            Student Portal
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            {mode === "login"
              ? "Sign in to view your courses and student details."
              : "We'll email you a link to set up your password."}
          </p>
        </div>

        {/* ---------------- LOGIN ---------------- */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Password</Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#B88A2A] text-white hover:bg-[#A37722]"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>

            <div className="flex flex-col items-center gap-1 pt-1 text-xs">
              <button
                type="button"
                onClick={() => switchMode("access")}
                className="font-semibold text-[#B88A2A] hover:underline"
              >
                First time here, or forgot your password?
              </button>
            </div>
          </form>
        )}

        {/* ---------------- REQUEST ACCESS ---------------- */}
        {mode === "access" && !linkSent && (
          <form onSubmit={handleRequestAccess} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold">
                Email you enrolled with
              </Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#B88A2A] text-white hover:bg-[#A37722]"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Email me a link
            </Button>

            <div className="text-center text-xs">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-[#B88A2A] hover:underline"
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}

        {/* ---------------- LINK SENT ---------------- */}
        {mode === "access" && linkSent && (
          <div className="space-y-4 text-center">
            <MailCheck className="mx-auto h-10 w-10 text-emerald-600" />
            <p className="text-sm text-[#222222]">
              If <span className="font-semibold">{email}</span> is registered,
              a link has been sent. It stays valid for 1 hour.
            </p>
            <p className="text-xs text-[#777777]">
              Can't find it? Check your spam folder, or make sure you're using
              the email you enrolled with.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => switchMode("login")}
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}