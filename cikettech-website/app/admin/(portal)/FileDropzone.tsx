"use client";

import { useRef, useState } from "react";
import { CloudUploadIcon } from "../../components/admin-icons";
import { adminFetch } from "../../lib/api";

export default function FileDropzone({
  label,
  hint,
  accept,
  className = "admin-dropzone",
  onUploaded,
}: {
  label: string;
  hint: string;
  accept?: string;
  className?: string;
  onUploaded?: (result: { url: string; name: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/admin/uploads", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUploaded?.({ url: data.url, name: data.name });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <CloudUploadIcon />
      <p>{fileName || label}</p>
      <span>
        {error ? error : uploading ? "Uploading..." : fileName ? "Uploaded — click to change" : hint}
      </span>
    </div>
  );
}
