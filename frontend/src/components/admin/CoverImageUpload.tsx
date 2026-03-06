import { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

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

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-cover',
      });

      onChange(newBlob.url);
      toast.success('Cover uploaded successfully');
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
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
        </div>
      </div>
    </div>
  );
}