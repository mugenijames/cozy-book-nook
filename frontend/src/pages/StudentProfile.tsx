// frontend/src/pages/StudentProfile.tsx


import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  GraduationCap,
  Lock,
  LogOut,
  Mail,
  Phone,
  PlayCircle,
  CalendarDays,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatMoney = (cents: number, currency = "KES") =>
  `${currency} ${(cents / 100).toLocaleString()}`;

const PAYMENT_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PARTIAL: "bg-amber-100 text-amber-700",
  UNPAID: "bg-red-100 text-red-700",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-200 text-gray-600",
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

function Badge({ label, styles }: { label: string; styles?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
        styles || "bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}

export default function StudentProfile() {
  const { student, studentLogout } = useAuth();

  // StudentRoute guarantees a student, this just keeps TypeScript happy
  if (!student) return null;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(student.studentNumber);
      toast.success("Student number copied");
    } catch {
      toast.error("Couldn't copy. Please copy it manually.");
    }
  };

  const enrollments = student.courseEnrollments;
  const programs = student.programRegistrations;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* ======================= HEADER ======================= */}
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F3EBE0]">
              <GraduationCap className="h-7 w-7 text-[#B88A2A]" />
            </div>
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold text-[#222222]">
                {student.fullName}
              </h1>

              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E6E6E6] bg-[#FAF6EF] px-3 py-1 text-xs font-bold tracking-wider text-[#B88A2A] hover:bg-[#F3EBE0]"
                title="Copy student number"
              >
                {student.studentNumber}
                <Copy className="h-3.5 w-3.5" />
              </button>

              <p className="text-[11px] text-[#777777]">
                Quote this number when contacting the team.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={studentLogout}
            className="self-start text-xs font-semibold"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-5 grid gap-3 border-t border-[#F0F0F0] pt-5 text-sm text-[#444444] sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#B88A2A]" />
            <span className="break-all">{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#B88A2A]" />
            <span>{student.phone || "No phone on file"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#B88A2A]" />
            <span>Student since {formatDate(student.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* ======================= COURSES ======================= */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-[#222222]">
          <BookOpen className="h-5 w-5 text-[#B88A2A]" /> My Courses
        </h2>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E6E6E6] bg-white py-12 text-center">
            <p className="text-sm text-gray-600">
              You haven't enrolled in a course yet.
            </p>
            <Link to="/courses">
              <Button variant="outline" className="mt-4">
                Browse courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {enrollments.map((en) => {
              const price = en.course.priceCents ?? 0;
              const paidPct =
                price > 0
                  ? Math.min(100, Math.round((en.amountPaidCents / price) * 100))
                  : 100;

              return (
                <div
                  key={en.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-[#E6E6E6] bg-white shadow-sm"
                >
                  <div className="flex gap-4 p-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F3EBE0]">
                      {en.course.thumbnailUrl ? (
                        <img
                          src={en.course.thumbnailUrl}
                          alt={en.course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-[#B88A2A] opacity-50" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="line-clamp-2 font-heading text-sm font-bold text-[#222222]">
                        {en.course.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          label={en.enrollmentStatus}
                          styles={STATUS_STYLES[en.enrollmentStatus]}
                        />
                        <Badge
                          label={en.paymentStatus}
                          styles={PAYMENT_STYLES[en.paymentStatus]}
                        />
                      </div>
                      <p className="text-[11px] text-[#777777]">
                        Enrolled {formatDate(en.enrolledAt)}
                        {en.completedAt &&
                          ` • Completed ${formatDate(en.completedAt)}`}
                      </p>
                    </div>
                  </div>

                  {/* Payment progress (paid courses only) */}
                  {price > 0 && (
                    <div className="px-5 pb-4">
                      <div className="mb-1 flex justify-between text-[11px] text-[#555555]">
                        <span>
                          Paid {formatMoney(en.amountPaidCents, en.course.currency)}
                        </span>
                        <span>
                          of {formatMoney(price, en.course.currency)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#B88A2A]"
                          style={{ width: `${paidPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-auto border-t border-[#F0F0F0] p-4">
                    {en.enrollmentStatus === "CANCELLED" ? (
                      <p className="text-center text-xs text-gray-500">
                        This enrollment was cancelled.
                      </p>
                    ) : en.accessGranted ? (
                      <Link to={`/learn/${en.course.slug}`}>
                        <Button className="w-full bg-[#B88A2A] text-xs font-semibold text-white hover:bg-[#A37722]">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {en.enrollmentStatus === "COMPLETED"
                            ? "Review course"
                            : "Continue learning"}
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        <Lock className="h-3.5 w-3.5" />
                        Materials unlock once your payment is confirmed.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================= PROGRAMS ======================= */}
      {programs.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-[#222222]">
            <Briefcase className="h-5 w-5 text-[#B88A2A]" /> My Programs
          </h2>

          <div className="divide-y divide-[#F0F0F0] rounded-xl border border-[#E6E6E6] bg-white shadow-sm">
            {programs.map((reg) => (
              <div
                key={reg.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <Link
                    to={`/programs/${reg.program.slug}`}
                    className="text-sm font-bold text-[#222222] hover:text-[#B88A2A] hover:underline"
                  >
                    {reg.program.title}
                  </Link>
                  <p className="text-[11px] text-[#777777]">
                    Registered {formatDate(reg.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {reg.status === "APPROVED" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  <Badge label={reg.status} styles={STATUS_STYLES[reg.status]} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}