// frontend/src/components/CoverImageUpload.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { getApiBase } from '@/services/api';

interface CoverImageUploadProps {
  currentUrl?: string | null;
  onChange: (url: string | null) => void;
}

export default function CoverImageUpload({ currentUrl, onChange }: CoverImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      // Get auth token
      const token = localStorage.getItem("admin_token");
      const apiBase = getApiBase();
      
      // Create form data
      const formData = new FormData();
      formData.append('cover', file);

      console.log('📤 Uploading to:', `${apiBase}/api/upload-cover`);
      
      // Upload to your backend
      const response = await fetch(`${apiBase}/api/upload-cover`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Upload successful:', data.url);
      
      onChange(data.url);
      toast.success('Cover uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <Label>Cover Image</Label>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Preview area */}
        <div className="relative h-48 w-36 overflow-hidden rounded-lg border bg-muted">
          {preview ? (
            <>
              <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Upload className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-3">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
          />
          
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Recommended: Square or portrait orientation, max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}