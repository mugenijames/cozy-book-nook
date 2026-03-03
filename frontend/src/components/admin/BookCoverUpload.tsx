// src/components/admin/BookCoverUpload.tsx
import { useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function BookCoverUpload({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/upload-cover', // your endpoint
      });

      onUploadComplete(newBlob.url);
      console.log('Uploaded to:', newBlob.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}