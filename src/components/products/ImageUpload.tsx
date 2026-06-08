"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (urls: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const urls = value.split("\n").filter(Boolean);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);

    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      newUrls.push(data.url);
    }

    onChange([...urls, ...newUrls].join("\n"));
    setUploading(false);
  };

  const removeUrl = (index: number) => {
    const updated = urls.filter((_, i) => i !== index);
    onChange(updated.join("\n"));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Product Images</label>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-600">
              Click to upload images
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP — max 5 MB each</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {urls.length > 0 && (
        <div className="space-y-2">
          {urls.map((url, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-10 w-10 rounded object-cover" />
              <span className="flex-1 truncate text-xs text-gray-500">{url}</span>
              <button type="button" onClick={() => removeUrl(i)} className="text-gray-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="mb-1 text-xs text-gray-500">Or paste image URLs (one per line):</p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
    </div>
  );
}
