"use client";
import { save } from "@/app/admin/actions";
import type { Kind } from "@/lib/cms";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUploader } from "@/components/image-uploader";

export function ContentForm({ kind, item }: { kind: Kind; item?: any }) {
  return (
    <form className="form" action={save.bind(null, kind, item?.id)}>
      <label>
        Title
        <input name="title" defaultValue={item?.title} required />
      </label>

      {kind === "voice" && (
        <>
          <label>
            Author name
            <input name="authorName" defaultValue={item?.authorName} required />
          </label>
          <label>
            Author role
            <input name="authorRole" defaultValue={item?.authorRole || ""} />
          </label>
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>Featured image <small style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</small></span>
        <ImageUploader name="featuredImage" defaultValue={item?.featuredImage || ""} />
      </div>

      <label>
        Content
        <small style={{ fontWeight: 400, color: "var(--muted)", marginTop: 4 }}>
          HTML supported: &lt;p&gt; &lt;h2&gt; &lt;h3&gt; &lt;strong&gt; &lt;em&gt; &lt;ul&gt; &lt;ol&gt; &lt;li&gt; &lt;a&gt; &lt;blockquote&gt; &lt;img&gt;
        </small>
        <div style={{ marginTop: "12px" }}>
          <RichTextEditor name="content" defaultValue={item?.content ?? ""} />
        </div>
      </label>

      {kind === "voice" && (
        <label>
          Sources / references (optional)
          <textarea
            name="references"
            rows={4}
            defaultValue={item?.references || ""}
          />
        </label>
      )}

      <label>
        Status
        <select name="status" defaultValue={item?.status || "DRAFT"}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>

      <button className="button primary">Save</button>
    </form>
  );
}
