import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import React, { useState } from "react";
import { FaBold, FaItalic, FaStrikethrough, FaHeading } from "react-icons/fa";
import { BiUpload } from "react-icons/bi";
import { BsFillImageFill } from "react-icons/bs";
import { FileInt } from "../../../models/interfaces";

const MenuBar = ({
  editor,
  file,
  setFile,
  addPhoto,
  userUpload,
  setUserUpload,
}: {
  editor: Editor;
  file: any | null;
  setFile: (data: any) => void;
  addPhoto: (data: any) => Promise<{ name: string; url: string }[] | null>;
  userUpload: FileInt[] | null;
  setUserUpload: (data: FileInt[]) => void;
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
        if (userUpload) {
          console.log(userUpload);
          const allFiles = userUpload.concat(files);
          setUserUpload(allFiles);
          files.forEach((item) => addImage(item.url));
          console.log(allFiles);
        } else {
          setUserUpload(files);
          files.forEach((item) => addImage(item.url));
        }
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
    <div className="flex items-center gap-3 py-1 px-2 rounded-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "is-active p-2 rounded-md duration-200 bg-shark text-gray-100"
            : "p-2 rounded-md text-stone-800 duration-200 hover:bg-gray-300"
        }
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "is-active p-2 rounded-md duration-200 bg-shark text-gray-100"
            : "p-2 rounded-md text-stone-800 duration-200 hover:bg-gray-300"
        }
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "is-active p-2 rounded-md duration-200 bg-shark text-gray-100"
            : "p-2 rounded-md text-stone-800 duration-200 hover:bg-gray-300"
        }
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "is-active p-2 rounded-md duration-200 bg-shark text-gray-100"
            : "p-2 rounded-md text-stone-800 duration-200 hover:bg-gray-300"
        }
      >
        <FaHeading />
      </button>
      {newImg ? (
        <div className="flex items-center gap-3">
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
              className="p-2 rounded-md text-sm block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
            />
          </form>
          <p className="font-bold">OU</p>
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
            className="p-1 px-3 text-sm rounded-full font-semibold flex items-center gap-2 text-gray-100 bg-stone-800 duration-200 hover:bg-stone-900"
          >
            <p>ENVIAR</p>
            <BiUpload />
          </button>
          <button
            onClick={handleImage}
            className="p-1 px-3 rounded-full font-semibold text-sm bg-shark text-gray-100 duration-200 hover:bg-shark-600"
          >
            CONFIRMAR
          </button>
          <button
            className="p-1 px-3 font-semibold text-sm rounded-full bg-gray-200 text-amaranth duration-200 hover:bg-amaranth-600 hover:text-gray-100"
            onClick={() => setNewImg(false)}
          >
            CANCELAR
          </button>
        </div>
      ) : (
        <button
          onClick={() => setNewImg(true)}
          className="p-2 rounded-md text-stone-800 duration-200 hover:bg-gray-300"
        >
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
  userUpload,
  setUserUpload,
}: {
  file: any | null;
  html: string;
  setHtml: (data: string) => void;
  title: string;
  setTitle: (data: string) => void;
  setFile: (data: any) => void;
  addPhoto: (data: any) => Promise<{ name: string; url: string }[] | null>;
  userUpload: FileInt[] | null;
  setUserUpload: (data: FileInt[]) => void;
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
        class: "prose lg:prose-lg focus:outline-none indent-2 text-stone-800",
      },
    },
  });

  return (
    <div>
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        className="p-2 px-4 w-full rounded-lg text-base lg:text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
      />
      <div className="mt-4 p-1 rounded-md border border-gray-300">
        <MenuBar
          editor={editor}
          file={file}
          setFile={setFile}
          addPhoto={addPhoto}
          userUpload={userUpload}
          setUserUpload={setUserUpload}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
