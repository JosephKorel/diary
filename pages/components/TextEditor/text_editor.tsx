import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { FaBold, FaItalic, FaStrikethrough, FaHeading } from "react-icons/fa";
import { AiOutlineLine } from "react-icons/ai";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "is-active rounded p-1 bg-stone-800 duration-200"
            : "p-1"
        }
      >
        <FaBold className={editor.isActive("bold") && "text-slate-100"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "is-active rounded p-1 bg-stone-800 duration-200"
            : "p-1"
        }
      >
        <FaItalic className={editor.isActive("italic") && "text-slate-100"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "is-active rounded p-1 bg-stone-800 duration-200"
            : "p-1"
        }
      >
        <FaStrikethrough
          className={editor.isActive("strike") && "text-slate-100"}
        />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "is-active rounded p-1 bg-stone-800 duration-200"
            : "p-1"
        }
      >
        <FaHeading className={editor.isActive("heading") && "text-slate-100"} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <AiOutlineLine className="p-1 hover:bg-stone-800 hover:text-slate-100 duration-200" />
      </button>
    </div>
  );
};

export default function TextEditor({
  text,
  setHtml,
}: {
  text: string;
  setHtml: (data: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  return (
    <div>
      <div className="p-1 rounded-md border border-stone-800">
        <MenuBar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
