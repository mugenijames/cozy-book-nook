// src/features/admin/settings/LegalEditor.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalEditor() {
  const [privacyContent, setPrivacyContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch current legal content
  useEffect(() => {
    fetch("/api/legal/privacy")
      .then(res => res.json())
      .then(data => setPrivacyContent(data.content));
    fetch("/api/legal/terms")
      .then(res => res.json())
      .then(data => setTermsContent(data.content));
  }, []);

  const handleSave = async (type: string, content: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/legal/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (response.ok) {
        toast.success(`${type} updated successfully`);
      }
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2E1208]">Legal Documents</h2>
        <p className="text-gray-600">Edit Privacy Policy and Terms & Conditions</p>
      </div>

      <Tabs defaultValue="privacy">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
            ⚠️ Last updated: March 2024 | Version 2.1
          </div>
          <Textarea
            value={privacyContent}
            onChange={(e) => setPrivacyContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Enter privacy policy content here..."
          />
          <Button onClick={() => handleSave("privacy", privacyContent)} disabled={saving}>
            {saving ? "Saving..." : "Save Privacy Policy"}
          </Button>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
            ⚠️ Last updated: March 2024 | Version 2.0
          </div>
          <Textarea
            value={termsContent}
            onChange={(e) => setTermsContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Enter terms and conditions here..."
          />
          <Button onClick={() => handleSave("terms", termsContent)} disabled={saving}>
            {saving ? "Saving..." : "Save Terms & Conditions"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}