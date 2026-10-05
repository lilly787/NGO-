"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

interface MultiImageUploaderProps {
  name: string;
  defaultValue?: string[];
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function MultiImageUploader({ name, defaultValue = [] }: MultiImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const selectedFiles = Array.from(files);
    setError("");
    if (!selectedFiles.length) return;
    if (selectedFiles.some((file) => !ALLOWED_TYPES.includes(file.type))) return setError("Only JPEG, PNG, WebP or GIF images are allowed.");
    if (selectedFiles.some((file) => file.size > MAX_SIZE_BYTES)) return setError("Each image must be smaller than 10MB.");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) return setError("Cloudinary is not configured. Please add the Cloudinary environment variables.");

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "gsei");
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body?.error?.message ?? "One or more images could not be uploaded.");
        }
        const data = await response.json();
        return data.secure_url as string;
      }));
      setImageUrls((current) => [...current, ...uploadedUrls]);
    } catch (uploadError: unknown) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    <input type="hidden" name={name} value={JSON.stringify(imageUrls)} />
    {imageUrls.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
      {imageUrls.map((imageUrl) => <div key={imageUrl} style={{ position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="News gallery preview" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "10px", display: "block" }} />
        <button type="button" onClick={() => setImageUrls((current) => current.filter((url) => url !== imageUrl))} aria-label="Remove image" style={{ position: "absolute", top: "8px", right: "8px", border: 0, borderRadius: "50%", width: "30px", height: "30px", display: "grid", placeItems: "center", background: "rgba(0,0,0,.72)", color: "#fff", cursor: "pointer" }}><X size={16} /></button>
      </div>)}
    </div>}
    <button type="button" className="button" onClick={() => inputRef.current?.click()} disabled={uploading} style={{ alignSelf: "flex-start" }}>
      {uploading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={16} />}
      {uploading ? "Uploading images…" : imageUrls.length ? "Add more images" : "Choose images"}
    </button>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(event) => event.target.files && uploadFiles(event.target.files)} style={{ display: "none" }} />
    {!imageUrls.length && !uploading && <span style={{ color: "var(--muted)", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}><ImageIcon size={16} /> Select several images at once, up to 10MB each.</span>}
    {error && <p style={{ margin: 0, color: "#ff6b81", fontSize: "13px" }}>{error}</p>}
  </div>;
}
