// frontend/src/pages/SetPassword.tsx

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, KeyRound, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const MIN_LENGTH = 8; // must match the backend rule

export default function SetPassword() {
  const { studentSetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);

  // No token in the URL at all
  if (!token || linkInvalid) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#E6E6E6] bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-600" />
          <h1 className="font-heading text-xl font-bold text-[#222222]">
            This link isn't valid
          </h1>
          <p className="mt-2 text-sm text-[#777777]">
            It may have expired (links last 1 hour) or already been used.
            Request a new one and try again.
          </p>
          <Link to="/student/login">
            <Button className="mt-5 w-full bg-[#B88A2A] text-white hover:bg-[#A37722]">
              Request a new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < MIN_LENGTH) {
      toast.error(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords don't match.");
      return;
    }

    try {
      setSubmitting(true);
      await studentSetPassword(token, password);
      toast.success("Password set. Welcome!");
      navigate("/profile", { replace: true });
    } catch (err: any) {
      // Backend answers 400 for an invalid/expired/used token
      if (err.status === 400 && /link|expired|invalid/i.test(err.message)) {
        setLinkInvalid(true);
      } else {
        toast.error(err.message || "Could not set your password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EBE0]">
            <KeyRound className="h-6 w-6 text-[#B88A2A]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#222222]">
            Set your password
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            Choose a password to access your student account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-bold">New password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`At least ${MIN_LENGTH} characters`}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password.length > 0 && password.length < MIN_LENGTH && (
              <p className="text-[11px] text-amber-600">
                {MIN_LENGTH - password.length} more character
                {MIN_LENGTH - password.length === 1 ? "" : "s"} needed
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">Confirm password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat the password"
              required
            />
            {mismatch && (
              <p className="text-[11px] text-red-600">
                Passwords don't match yet
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#B88A2A] text-white hover:bg-[#A37722]"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set password &amp; sign in
          </Button>
        </form>
      </div>
    </div>
  );
}