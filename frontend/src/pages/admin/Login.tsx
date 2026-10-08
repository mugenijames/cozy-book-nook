import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminLogin, adminDevLogin } from "@/services/adminAuth";
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
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isDevelopment =
    import.meta.env.DEV ||
    String(import.meta.env.VITE_ADMIN_DEV_BYPASS || "").toLowerCase() === "true";

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
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDevelopmentLogin = async () => {
    setDevLoading(true);

    try {
      const data = await adminDevLogin();
      login(data.token, data.user);
      toast.success("Development Super Admin session started.");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Development login failed."
      );
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2E1208]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#2E1208] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(193,123,79,0.20),transparent_42%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="David Emuria"
                className="h-12 w-12 rounded-xl border border-[#D4A017]/60 object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4A017]">
                  David Emuria
                </p>
                <p className="text-sm text-white/60">Administration</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A017]/30 bg-white/5 px-4 py-2 text-xs font-medium text-[#E8C66A]">
                <ShieldCheck className="h-4 w-4" />
                Secure administrator portal
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white xl:text-6xl">
                Manage the work that inspires purpose.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
                A dedicated workspace for managing books, orders, programs,
                enquiries and administrator access.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/45">
              <LockKeyhole className="h-4 w-4" />
              Administrator access only
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="David Emuria"
                  className="h-11 w-11 rounded-xl border border-[#D4A017]/50 object-cover"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C17B4F]">
                    David Emuria
                  </p>
                  <p className="text-sm text-[#8B7355]">Administration</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#8B7355] transition hover:text-[#C17B4F]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </button>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C17B4F]">
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Sign in to Admin
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8B7355]">
                Use your administrator credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#E8DDD4] bg-white p-6 shadow-[0_20px_60px_rgba(46,18,8,0.08)] sm:p-8"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading || devLoading}
                    required
                    className="h-12 rounded-xl border-[#D8CBBF] bg-[#FCFAF7]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading || devLoading}
                      required
                      className="h-12 rounded-xl border-[#D8CBBF] bg-[#FCFAF7] pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 px-3 text-[#8B7355] hover:text-[#C17B4F]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || devLoading}
                  className="h-12 w-full rounded-xl bg-[#2E1208] text-white shadow-lg hover:bg-[#431B0D]"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in securely
                </Button>
              </div>

              {isDevelopment && (
                <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-amber-900">
                        Development mode
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800/80">
                        Authentication bypass is available only when the backend
                        explicitly enables BYPASS_AUTH outside production.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDevelopmentLogin}
                        disabled={loading || devLoading}
                        className="mt-3 h-9 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
                      >
                        {devLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Enter development dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-[#9A8777]">
              Administrator accounts are created and controlled by authorized
              administrators.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
