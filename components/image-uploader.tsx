"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  defaultValue?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploader({ name, defaultValue = "" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(defaultValue);
  const [storedUrl, setStoredUrl] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, WebP or GIF images are allowed.");
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "gsei");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? `Upload failed (${res.status})`);
      }

      const data = await res.json();
      const secureUrl: string = data.secure_url;

      setStoredUrl(secureUrl);
      setPreview(secureUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(msg);
      // Revert preview if upload failed
      setPreview(defaultValue);
      setStoredUrl(defaultValue);
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview("");
    setStoredUrl("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Hidden field that submits to the server action */}
      <input type="hidden" name={name} value={storedUrl} />

      {preview ? (
        /* Image preview state */
        <div
          style={{
            position: "relative",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            overflow: "hidden",
            background: "var(--bg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Featured image preview"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Uploading overlay */}
          {uploading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#fff",
                fontFamily: "'DM Mono', monospace",
                fontSize: "13px",
                letterSpacing: "0.05em",
              }}
            >
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              Uploading…
            </div>
          )}

          {/* Actions bar */}
          {!uploading && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  padding: "8px 14px",
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Upload size={14} />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                style={{
                  padding: "8px",
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone / upload area */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "var(--orchid)" : "var(--line)"}`,
            borderRadius: "12px",
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            cursor: uploading ? "wait" : "pointer",
            background: isDragging ? "rgba(176,112,230,0.05)" : "transparent",
            transition: "border-color 0.25s, background 0.25s",
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={32} color="var(--orchid)" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ color: "var(--muted)", fontSize: "14px" }}>Uploading…</span>
            </>
          ) : (
            <>
              <ImageIcon size={32} color="var(--muted)" />
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, color: "var(--ink)", fontWeight: 500, fontSize: "14px" }}>
                  Click to upload or drag &amp; drop
                </p>
                <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "13px" }}>
                  JPEG, PNG, WebP — up to {MAX_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p
          style={{
            margin: 0,
            color: "#ff6b81",
            fontSize: "13px",
            padding: "10px 14px",
            background: "rgba(255,107,129,0.08)",
            border: "1px solid rgba(255,107,129,0.3)",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-label="Upload featured image"
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
