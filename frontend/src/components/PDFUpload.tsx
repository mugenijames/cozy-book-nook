// frontend/src/components/PDFUpload.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { getApiBase } from '@/services/api';

interface PDFUploadProps {
  currentUrl?: string | null;
  onChange: (url: string | null) => void;
}

export default function PDFUpload({ currentUrl, onChange }: PDFUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>(currentUrl ? 'PDF uploaded' : '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const token = localStorage.getItem("admin_token");
      const apiBase = getApiBase();
      
      const formData = new FormData();
      formData.append('pdf', file);

      console.log('📤 Uploading PDF to:', `${apiBase}/api/upload-pdf`);
      
      const response = await fetch(`${apiBase}/api/upload-pdf`, {
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
      console.log('✅ PDF uploaded:', data.url);
      
      onChange(data.url);
      toast.success('PDF uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      setFileName('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePDF = () => {
    onChange(null);
    setFileName('');
  };

  return (
    <div className="space-y-4">
      <Label>PDF File</Label>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        
        {currentUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(currentUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            View PDF
          </Button>
        )}
        
        {currentUrl && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removePDF}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading PDF...
        </div>
      )}
      
      {fileName && !uploading && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <FileText className="h-4 w-4" />
          {fileName}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Upload the book PDF (max 20MB). Customers will get access after purchase.
      </p>
    </div>
  );
}