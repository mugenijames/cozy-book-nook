// frontend/src/pages/admin/AdminCourseEnrollments.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAdminCourses,
  getCourseEnrollmentsAdmin,
  confirmAdminCoursePayment,
  Course,
  CourseEnrollment,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Users, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminCourseEnrollments() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment confirmation modal state
  const [selectedEnrollment, setSelectedEnrollment] = useState<CourseEnrollment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadData();
    }
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const courses = await getAdminCourses();
      const current = courses.find((c) => c.id === courseId);
      if (current) setCourse(current);

      const data = await getCourseEnrollmentsAdmin(courseId!);
      setEnrollments(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment || !paymentAmount) return;

    const amountCents = Math.round(Number(paymentAmount) * 100);
    if (amountCents <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    try {
      setSubmitting(true);
      await confirmAdminCoursePayment(selectedEnrollment.id, {
        amountCents,
        method: "MANUAL",
        transactionCode: transactionCode.trim() || undefined,
        notes: "Confirmed by admin",
      });

      toast.success("Payment recorded and access evaluated successfully!");
      setSelectedEnrollment(null);
      setPaymentAmount("");
      setTransactionCode("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/courses" className="text-xs font-semibold text-gray-500 hover:text-[#C17B4F] flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Courses
          </Link>
          <h1 className="text-3xl font-bold font-heading text-[#2E1208]">
            {course?.title ? `${course.title} — Student Enrollments` : "Course Enrollments"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">Monitor student registrations, payment progress, and content access.</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-[#C17B4F] mx-auto mb-3 opacity-60" />
          <p className="text-gray-600 font-medium">No students enrolled in this course yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3EBE0]/60 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600">
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold">Email / Phone</th>
                  <th className="p-4 font-bold">Total Paid</th>
                  <th className="p-4 font-bold">Access Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {enrollments.map((enrol) => {
                  const priceCents = course?.priceCents || 0;
                  const unlockPercent = course?.unlockPercent || 50;
                  const requiredCents = Math.ceil((priceCents * unlockPercent) / 100);

                  return (
                    <tr key={enrol.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4">
                        <p className="font-semibold text-[#2E1208]">{enrol.fullName}</p>
                        <p className="text-xs text-gray-400">Enrolled on {new Date(enrol.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-700">{enrol.email}</p>
                        <p className="text-xs text-gray-400">{enrol.phone || "No phone provided"}</p>
                      </td>
                      <td className="p-4 font-medium">
                        KES {(enrol.amountPaidCents / 100).toLocaleString()}
                        {!course?.isFree && (
                          <span className="block text-[11px] text-gray-400">
                            Required threshold: KES {(requiredCents / 100).toLocaleString()} ({unlockPercent}%)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          enrol.accessGranted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {enrol.accessGranted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          {enrol.accessGranted ? "Unlocked" : "Locked / Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEnrollment(enrol);
                            setPaymentAmount(String((course?.priceCents || 50000) / 100));
                          }}
                          className="bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                        >
                          <DollarSign className="h-3.5 w-3.5 mr-1" /> Record Payment
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold font-heading text-[#2E1208] mb-2">Record Manual Payment</h2>
            <p className="text-xs text-gray-500 mb-4">
              Student: <strong className="text-gray-700">{selectedEnrollment.fullName}</strong> ({selectedEnrollment.email})
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div className="space-y-1">
                <Label>Payment Amount (in KES) *</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Transaction / M-Pesa Code (Optional)</Label>
                <Input
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  placeholder="e.g. QHX789PL2K"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setSelectedEnrollment(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Payment & Evaluate Access
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}