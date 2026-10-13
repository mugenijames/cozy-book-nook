// frontend/src/pages/LoginPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminLogin } from "@/services/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await adminLogin(email.trim(), password);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}.`);
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2E1208] selection:bg-[#D4A017]/30">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* ======================= BRAND PANEL (LEFT) ======================= */}
        <section className="relative hidden overflow-hidden bg-[#2E1208] lg:flex lg:flex-col lg:justify-between lg:p-16 xl:p-20">
          {/* Ambient background lighting and grid patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(193,123,79,0.15),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Logo */}
          <div className="relative z-10">
            <img
              src="/logo.png"
              alt="David Emuria"
              className="h-24 w-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* Center Value Proposition */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#E8C66A] uppercase backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-[#D4A017]" />
              Authorized Administration Portal
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl/[1.15]">
              Leadership, governance &amp; digital excellence.
            </h1>

            <p className="text-base leading-relaxed text-white/70">
              Access your centralized management environment for books, orders, client bookings, and multi-tier administrative permissions.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/10 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4A017]" />
                Role-based access control
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4A017]" />
                Encrypted session security
              </div>
            </div>
          </div>

          {/* Footer Security Notice */}
          <div className="relative z-10 flex items-center gap-2.5 text-xs font-medium text-white/40 tracking-wider uppercase">
            <LockKeyhole className="h-3.5 w-3.5 text-[#D4A017]" />
            Secure TLS Connection • Restricted Personnel Only
          </div>
        </section>

        {/* ========================= FORM PANEL (RIGHT) ========================= */}
        <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 bg-[#FAF7F2]">
          <div className="mx-auto w-full max-w-md space-y-8">
            
            {/* Mobile Brand Emblem */}
            <div className="lg:hidden text-center mb-6">
              <img
                src="/logo.png"
                alt="David Emuria"
                className="mx-auto h-20 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Back button */}
            <div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#7D6B5D] transition-colors hover:text-[#2E1208]"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to public website
              </button>
            </div>

            {/* Header info */}
            <div className="space-y-2">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#B26435]">
                Secure Sign In
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#2E1208]">
                Admin Dashboard
              </h2>
              <p className="text-sm text-[#7D6B5D]">
                Enter your administrative credentials to access the workspace.
              </p>
            </div>

            {/* Main Form Card */}
            <div className="rounded-3xl border border-[#EBE3D9] bg-white p-8 shadow-[0_12px_40px_rgba(46,18,8,0.06)] backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#5A4738]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@davidemuria.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    required
                    className="h-12 rounded-xl border-[#E2D6CB] bg-[#FDFBF7] px-4 text-sm text-[#2E1208] placeholder:text-[#A8988B] focus-visible:border-[#2E1208] focus-visible:ring-1 focus-visible:ring-[#2E1208]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#5A4738]">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      required
                      className="h-12 rounded-xl border-[#E2D6CB] bg-[#FDFBF7] px-4 pr-12 text-sm text-[#2E1208] placeholder:text-[#A8988B] focus-visible:border-[#2E1208] focus-visible:ring-1 focus-visible:ring-[#2E1208]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-[#8C7565] transition-colors hover:text-[#2E1208]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#2E1208] font-medium text-white shadow-md transition-all hover:bg-[#431B0D] hover:shadow-lg active:scale-[0.99] disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sub-footer note */}
            <div className="text-center">
              <p className="text-xs leading-relaxed text-[#9C8879]">
                Protected by automated inactivity timeout protection (5 minutes). Unauthorized access attempts are monitored and logged.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}