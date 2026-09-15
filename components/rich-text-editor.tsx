"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { useCallback } from "react";

interface RichTextEditorProps {
  defaultValue?: string;
  name: string;
}

export function RichTextEditor({ defaultValue = "", name }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "12px",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Hidden input to store the HTML value for the server action form submission */}
      <input type="hidden" name={name} value={editor.getHTML()} />

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          borderBottom: "1px solid var(--line)",
          background: "rgba(0,0,0,0.2)",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("bold") ? "var(--orchid)" : "transparent",
            color: editor.isActive("bold") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("italic") ? "var(--orchid)" : "transparent",
            color: editor.isActive("italic") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <div style={{ width: "1px", background: "var(--line)", margin: "0 4px" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("heading", { level: 2 }) ? "var(--orchid)" : "transparent",
            color: editor.isActive("heading", { level: 2 }) ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("heading", { level: 3 }) ? "var(--orchid)" : "transparent",
            color: editor.isActive("heading", { level: 3 }) ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>

        <div style={{ width: "1px", background: "var(--line)", margin: "0 4px" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("bulletList") ? "var(--orchid)" : "transparent",
            color: editor.isActive("bulletList") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Bulleted List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("orderedList") ? "var(--orchid)" : "transparent",
            color: editor.isActive("orderedList") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <div style={{ width: "1px", background: "var(--line)", margin: "0 4px" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("blockquote") ? "var(--orchid)" : "transparent",
            color: editor.isActive("blockquote") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={setLink}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: editor.isActive("link") ? "var(--orchid)" : "transparent",
            color: editor.isActive("link") ? "#fff" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>

        <div style={{ width: "1px", background: "var(--line)", margin: "0 4px" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: "transparent",
            color: !editor.can().chain().focus().undo().run() ? "rgba(255,255,255,0.1)" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: "transparent",
            color: !editor.can().chain().focus().redo().run() ? "rgba(255,255,255,0.1)" : "var(--muted)",
            border: "none",
            cursor: "pointer",
          }}
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      <style jsx global>{`
        .ProseMirror {
          padding: 16px;
          min-height: 300px;
          outline: none;
          font-size: 16px;
          line-height: 1.65;
          color: var(--ink);
        }
        .ProseMirror p {
          margin-bottom: 1em;
        }
        .ProseMirror h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--orchid);
          padding-left: 1em;
          margin-left: 0;
          margin-bottom: 1em;
          color: var(--muted);
          font-style: italic;
        }
        .ProseMirror a {
          color: var(--orchid);
          text-decoration: underline;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted);
          pointer-events: none;
          height: 0;
        }
      `}</style>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
