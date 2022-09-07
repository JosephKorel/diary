import React, { useState } from "react";
import moment from "moment";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../firebase.config";
import { FileInt, MyNotes, User } from "../../models/interfaces";
import TextEditor from "./TextEditor/text_editor";
import { MdLibraryAdd, MdEdit } from "react-icons/md";
import { BsEraserFill } from "react-icons/bs";
import { AiOutlineClose, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

interface NoteComponent {
  noteProps: {
    currentNotes: (data: User) => void;
    user: User;
    myNotes: MyNotes[];
    setShow: (data: boolean) => void;
    setElement: (data: JSX.Element) => void;
    card: number;
    setCard: (data: number) => void;
  };
}

export default function MyNotesComponent({
  noteProps,
}: NoteComponent): JSX.Element {
  const [showNotes, setShowNotes] = useState(false);
  const [edit, setEdit] = useState<boolean | number>(false);
  const [showNote, setShowNote] = useState<boolean | number>(false);

  const { currentNotes, user, myNotes, setShow, setElement, card, setCard } =
    noteProps;

  const addPhoto = async (
    file: any
  ): Promise<{ name: string; url: string }[] | null> => {
    let uploadedFiles: { name: string; url: string }[] = [];
    let files: any[] = [];
    Object.entries(file).forEach(([key, value]) => files.push(value));

    try {
      for (let item of files) {
        const imgref = ref(storage, `${user.email}/${item.name}`);
        await uploadBytes(imgref, item);
        const url = await getDownloadURL(imgref);
        uploadedFiles.push({ name: item.name, url });
      }

      return uploadedFiles;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const AddNewNote = (): JSX.Element => {
    const [file, setFile] = useState<null | any>(null);
    const [html, setHtml] = useState("<p>We should eat chocolate</p>");
    const [title, setTitle] = useState("");
    const [userUpload, setUserUpload] = useState<FileInt[]>([]);

    //Adiciona a nota
    const addNote = async (
      html: string,
      title: string
    ): Promise<void | null> => {
      if (html === "" || title === "") return null;

      const today = moment().format("DD/MM/YY");

      //Houve upload de imagem

      const newNote = {
        author: user.name,
        email: user.email,
        title,
        note: html,
        media: userUpload,
        date: today,
      };

      //Adiciona uma nova nota
      const insert = await fetch(`/api/notes/${user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      try {
        if (insert.ok) {
          currentNotes(user);
          setShow(false);
          setFile(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div
        className="bg-green-400 p-20 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="p-2 bg-slate-100">
            <TextEditor
              html={html}
              setHtml={setHtml}
              title={title}
              setTitle={setTitle}
              file={file}
              setFile={setFile}
              addPhoto={addPhoto}
              userUpload={null}
              setUserUpload={setUserUpload}
            />
          </div>
        </div>
        <button onClick={() => addNote(html, title)}>Adicionar</button>
        <button onClick={() => setShow(false)}>Cancelar</button>
      </div>
    );
  };

  const deleteNote = async (note: MyNotes) => {
    //Se houver imagens, deleta as imagens no storage
    if (note.media.length > 0) {
      note.media.forEach((item) => {
        const imgRef = ref(storage, `${note.email}/${item.name}`);
        deleteObject(imgRef);
      });
    }

    const handleDelete = await fetch(`/api/notes/[notes]/${note._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (handleDelete.ok) {
        currentNotes(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const NoteEditComponent = ({
    targetNote,
  }: {
    targetNote: MyNotes;
  }): JSX.Element => {
    const [photo, setPhoto] = useState<any | null>(null);
    const [content, setContent] = useState(targetNote.note);
    const [title, setTitle] = useState(targetNote.title);
    const [userUpload, setUserUpload] = useState<FileInt[]>(targetNote.media);

    const editNote = async (note: MyNotes): Promise<void | null> => {
      if (content === targetNote.note) {
        setShow(false);
        setEdit(false);
        return null;
      }
      const handleEdit = await fetch(`/api/notes/[notes]/${note._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ edit: content, title, media: userUpload }),
      });

      try {
        if (handleEdit.ok) {
          currentNotes(user);
          setEdit(false);
          setShow(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <div className="p-2 bg-slate-100">
          <TextEditor
            html={content}
            setHtml={setContent}
            title={title}
            setTitle={setTitle}
            file={photo}
            setFile={setPhoto}
            addPhoto={addPhoto}
            userUpload={userUpload}
            setUserUpload={setUserUpload}
          />
        </div>
        <div>
          <button onClick={() => editNote(targetNote)}>Salvar</button>
          <button onClick={() => setEdit(false)}>Cancelar</button>
        </div>
      </div>
    );
  };

  return (
    <>
      {card === 3 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800 mb-4">
            <h2 className="text-xl font-bold">ANOTAÇÕES</h2>
            <button
              className="duration-200 p-1 hover:bg-stone-800 hover:text-gray-100 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                setCard(0);
              }}
            >
              <AiOutlineClose />
            </button>
          </div>
          {myNotes.map((item, index) => (
            <div
              onClick={() => setShowNote(index)}
              className={`p-2 mt-2 border rounded-b-md shadow-sm duration-200 hover:rounded-md hover:border  ${
                showNote === index
                  ? "border-stone-900 rounded-md"
                  : "border-transparent border-b-stone-900 cursor-pointer hover:border-stone-800 hover:bg-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-shark rounded-full"></div>
                  <h3
                    key={index}
                    className="italic font-semibold text-lg text-stone-900"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="text-shark">
                  {showNote === index ? (
                    <AiFillCaretUp
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNote(false);
                      }}
                      className="cursor-pointer duration-200 hover:text-shark-600"
                    />
                  ) : (
                    <AiFillCaretDown size={20} />
                  )}
                </div>
              </div>
              {showNote === index && (
                <div className="prose lg:prose-lg max-w-none mt-4 w-full fade flex flex-col">
                  <div
                    dangerouslySetInnerHTML={{ __html: item.note }}
                    className="p-2 indent-2 lg:max-h-80 overflow-y-auto"
                  ></div>
                  <div className="flex items-center gap-2 self-end">
                    <button
                      onClick={() => {
                        setShow(true);
                        setElement(<NoteEditComponent targetNote={item} />);
                      }}
                      className="p-1 duration-200 hover:bg-shark hover:text-gray-100 rounded-md"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => deleteNote(item)}
                      className="p-1 duration-200 hover:bg-amaranth-600 hover:text-gray-100 rounded-md"
                    >
                      <BsEraserFill />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="float-right mt-4">
            <button
              className="flex items-center gap-1 text-gray-100 font-semibold p-2 rounded-full px-4 bg-shark duration-200 hover:text-white hover:bg-shark-700"
              onClick={(e) => {
                e.stopPropagation();
                setElement(<AddNewNote />);
                setShow(true);
              }}
            >
              <p className="w-14">NOVA</p>
              <MdLibraryAdd />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col justify-center items-center w-full`}
          onClick={() => {
            setCard(3);
          }}
        >
          <h2 className="text-xl font-bold">ANOTAÇÕES</h2>
          <p className="text-3xl p-2">{myNotes.length}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setElement(<AddNewNote />);
              setShow(true);
            }}
            className="hover:text-ronchi"
          >
            <MdLibraryAdd size={25} />
          </button>
        </div>
      )}
    </>
  );
}

{
  /* <li key={index}>
                  {edit === index ? (
                    <>
                      <button onClick={() => setEdit(false)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.note }}
                      ></div>
                      <button onClick={() => deleteNote(item)}>Excluir</button>
                      <button
                        onClick={() => {
                          setShow(true);
                          setElement(<NoteEditComponent targetNote={item} />);
                        }}
                      >
                        Editar
                      </button>
                      <button onClick={() => setShowNote(false)}>
                        Minimizar
                      </button>
                    </>
                  )}
                </li> */
}
