import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import React, { useState } from "react";
import { FaBold, FaItalic, FaStrikethrough, FaHeading } from "react-icons/fa";
import { AiOutlineLine } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import Head from "next/head";

const MenuBar = ({
  editor,
  file,
  setFile,
  addPhoto,
}: {
  editor: Editor;
  file: any | null;
  setFile: (data: any) => void;
  addPhoto: (data: any) => Promise<{ name: string; url: string }[] | null>;
}) => {
  const [newImg, setNewImg] = useState(false);
  const [url, setUrl] = useState("");
  if (!editor) {
    return null;
  }

  const handleImage = async () => {
    if (file !== null) {
      try {
        const files = await addPhoto(file);
        files.forEach((item) => addImage(item.url));
        setFile(null);
      } catch (error) {
        console.log(error);
      }
    } else addImage(url);
  };

  const addImage = (imgurl: string) => {
    if (imgurl) {
      editor.chain().focus().setImage({ src: imgurl }).run();
      setNewImg(false);
    }
  };

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
      {newImg ? (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addImage(url);
            }}
          >
            <input
              placeholder="URL da imagem"
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
            />
          </form>
          <p>OU</p>
          <input
            type="file"
            multiple
            onChange={(e) => setFile(e.currentTarget.files)}
            className="hidden"
            id="file_upload"
          />
          <button
            onClick={() => {
              document.getElementById("file_upload").click();
            }}
          >
            Fazer Upload
          </button>
          <button onClick={handleImage}>Confirmar</button>
        </div>
      ) : (
        <button onClick={() => setNewImg(true)}>
          <BsFillImageFill />
        </button>
      )}
    </div>
  );
};

export default function TextEditor({
  file,
  html,
  setHtml,
  title,
  setTitle,
  setFile,
  addPhoto,
}: {
  file: any | null;
  html: string;
  setHtml: (data: string) => void;
  title: string;
  setTitle: (data: string) => void;
  setFile: (data: any) => void;
  addPhoto: (data: any) => Promise<{ name: string; url: string }[] | null>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "w-1/3",
        },
      }),
    ],
    content: html,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none bg-red-300",
      },
    },
  });

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography/dist/typography.min.css"
        />
        ;
      </Head>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <div className="p-1 rounded-md border border-stone-800">
        <MenuBar
          editor={editor}
          file={file}
          setFile={setFile}
          addPhoto={addPhoto}
        />
      </div>
      <div className="p-1 rounded-md border border-stone-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
