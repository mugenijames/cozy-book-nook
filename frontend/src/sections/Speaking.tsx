import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
    eventType: "",
    date: "",
    location: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.eventType.trim()) newErrors.eventType = "Event type is required";
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
      
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Example real implementation (uncomment when ready):
      // await fetch("/api/invite-david", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      toast.success("Invite sent successfully! David will be notified.");
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        date: "",
        location: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send invite. Please try again.");
      console.error(error);
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

          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center text-[#2E1208]">
                Invite David to Speak
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              <div>
                <Label htmlFor="name" className="text-[#2E1208]">
                  Your Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-[#2E1208]">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-[#2E1208]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div>
                <Label htmlFor="eventType" className="text-[#2E1208]">
                  Event Type *
                </Label>
                <Input
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Conference, Church Event, Workshop, etc."
                />
                {errors.eventType && (
                  <p className="text-red-600 text-sm mt-1">{errors.eventType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date" className="text-[#2E1208]">
                  Preferred Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <Label htmlFor="location" className="text-[#2E1208]">
                  Event Location / City
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Nairobi, Kenya"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-[#2E1208]">
                  Additional Message / Details
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 min-h-[100px]"
                  placeholder="Tell us more about the event, audience size, duration, etc."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#D4A017] hover:bg-[#b58900] text-[#2E1208]"
                >
                  {submitting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Speaking;