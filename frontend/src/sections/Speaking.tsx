import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Speaking = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    date: "",
    location: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.program.trim()) newErrors.program = "Program is required";
    if (!formData.date.trim()) newErrors.date = "Preferred date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
  
    setSubmitting(true);
  
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // ✅ FIXED: Correct endpoint
      const response = await fetch(`${API_BASE}/api/invite`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }
  
      toast.success("Invite sent successfully! You'll receive a confirmation email shortly.");
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        date: "",
        location: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending invite:", error);
      toast.error(error.message || "Failed to send invite. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="speaking" className="py-24 bg-[#2E1208] text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Speaking & Consulting</h2>

        <p className="max-w-3xl mx-auto mb-10 text-gray-300 text-lg leading-relaxed">
          David is available for conferences, leadership trainings, youth empowerment programs,
          church events, corporate workshops, and more.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="px-10 py-6 bg-[#D4A017] hover:bg-[#b58900] text-[#2E1208] font-semibold text-lg transition-colors shadow-md"
              aria-label="Invite David to speak at your event"
            >
              Invite David
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[85vh] max-w-[calc(100vw-2rem)] sm:max-w-[600px] gap-0 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FDF8F3] p-0 shadow-2xl shadow-black/25 flex flex-col">
            <DialogHeader className="flex-shrink-0 space-y-3 border-b border-[#E8DDD4] bg-gradient-to-b from-[#FAF3EB] to-[#FDF8F3] px-6 pb-5 pt-6 text-center">
              <div
                className="mx-auto h-1 w-12 rounded-full bg-[#D4A017]"
                aria-hidden
              />
              <DialogTitle className="font-heading text-2xl font-semibold tracking-tight text-[#2E1208] md:text-[1.65rem]">
                Invite David to Speak
              </DialogTitle>
              <DialogDescription className="mx-auto max-w-md text-[0.9375rem] leading-relaxed text-[#5C4436]">
                Share a few details about your event. David will review and respond within 2-3 business days.
                You'll receive a confirmation email immediately.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Fields */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="name" className="text-sm font-medium text-[#3D2817]">
                      Your Name <span className="text-[#9A5C2E]">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm placeholder:text-[#8A7B72] focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-700" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="email" className="text-sm font-medium text-[#3D2817]">
                      Email Address <span className="text-[#9A5C2E]">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm placeholder:text-[#8A7B72] focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-700" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[#3D2817]">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm placeholder:text-[#8A7B72] focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="program" className="text-sm font-medium text-[#3D2817]">
                      Program <span className="text-[#9A5C2E]">*</span>
                    </Label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-[#D4C4B8] bg-white px-3 text-[#2E1208] shadow-sm focus-visible:border-[#D4A017] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017]/35"
                    >
                      <option value="">Select a program</option>
                      <option value="School Ministry">School Ministry</option>
                      <option value="Church Outreaches">Church Outreaches</option>
                      <option value="Leadership Training Program">
                        Leadership Training Program
                      </option>
                      <option value="Philanthropy">Philanthropy</option>
                    </select>
                    {errors.program && (
                      <p className="text-sm text-red-700" role="alert">
                        {errors.program}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="date" className="text-sm font-medium text-[#3D2817]">
                      Preferred Date <span className="text-[#9A5C2E]">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                    />
                    {errors.date && (
                      <p className="text-sm text-red-700" role="alert">
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="location" className="text-sm font-medium text-[#3D2817]">
                      Event Location / City
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm placeholder:text-[#8A7B72] focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                      placeholder="Nairobi, Kenya"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="message" className="text-sm font-medium text-[#3D2817]">
                      Additional Message / Details
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-[100px] resize-y rounded-lg border-[#D4C4B8] bg-white text-[#2E1208] shadow-sm placeholder:text-[#8A7B72] focus-visible:border-[#D4A017] focus-visible:ring-[#D4A017]/35"
                      placeholder="Audience size, duration, theme, budget range—anything that helps."
                    />
                  </div>
                </div>
              </div>

              
              <DialogFooter className="flex-shrink-0 flex-col gap-3 border-t border-[#E8DDD4] bg-[#FDF8F3] px-6 py-5 sm:flex-row sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-11 w-full rounded-lg border-[#C9B8A8] bg-white text-[#3D2817] hover:bg-[#FAF3EB] sm:w-auto sm:min-w-[7rem]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full rounded-lg bg-[#D4A017] font-semibold text-[#2E1208] shadow-md transition-colors hover:bg-[#b58900] disabled:opacity-60 sm:w-auto sm:min-w-[10rem]"
                >
                  {submitting ? "Sending…" : "Send Invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Speaking;