"use client";

import { useRef } from "react";

export function DeleteButton({
  title,
  action,
}: {
  title: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} style={{ display: "contents" }}>
      <button
        type="button"
        className="button danger"
        style={{
          fontSize: "13px",
          minHeight: "38px",
          padding: "8px 14px",
          border: "1px solid rgba(255,107,129,0.4)",
        }}
        onClick={() => {
          if (confirm(`Delete "${title}"? This cannot be undone.`)) {
            formRef.current?.requestSubmit();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
