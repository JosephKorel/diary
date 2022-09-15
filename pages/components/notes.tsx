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
import { MdLibraryAdd, MdEdit, MdEditNote } from "react-icons/md";
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
    setMsg: (data: string) => void;
    setErrorMsg: (data: string) => void;
  };
}

export default function MyNotesComponent({
  noteProps,
}: NoteComponent): JSX.Element {
  const [edit, setEdit] = useState<boolean | number>(false);
  const [showNote, setShowNote] = useState<boolean | number>(false);

  const {
    currentNotes,
    user,
    myNotes,
    setShow,
    setElement,
    card,
    setCard,
    setMsg,
    setErrorMsg,
  } = noteProps;

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

  const NotePopup = ({ note }: { note: MyNotes }): JSX.Element => {
    return (
      <div className="w-[35%] m-auto pt-0 pb-4 px-1 bg-gray-100 border border-gray-400 rounded-md">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-2 border-stone-800 pb-1">
            <p className="text-2xl font-bold text-stone-800">
              EXCLUIR ANOTAÇÃO
            </p>
            <button
              className="duration-200 text-gray-800 p-2 hover:bg-amaranth hover:text-gray-100 rounded-md"
              onClick={() => setShow(false)}
            >
              <AiOutlineClose size={25} />
            </button>
          </div>
          <div className="py-5 px-1">
            <p className="text-lg">Deseja mesmo excluir esta nota?</p>
          </div>
          <div className="flex items-center gap-2 px-1 mt-4">
            <button
              onClick={() => deleteNote(note)}
              className="font-semibold py-2 px-4 text-lg rounded-md bg-shark text-gray-100 duration-200 hover:bg-shark-600"
            >
              SIM
            </button>
            <button
              onClick={() => setShow(false)}
              className="font-semibold py-2 px-4 text-lg rounded-md bg-amaranth text-gray-100 duration-200 hover:bg-amaranth-600"
            >
              NÃO
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddNewNote = (): JSX.Element => {
    const [file, setFile] = useState<null | any>(null);
    const [html, setHtml] = useState(
      "<p>Espero que você esteja tendo um ótimo dia :D</p>"
    );
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
          setMsg("Nota adicionada");
        }
      } catch (error) {
        setErrorMsg("Houve algum erro, tente novamente");
      }
    };

    return (
      <div
        className="bg-gray-100 p-10 py-5 scaleup rounded-md w-2/3 m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-2xl flex items-center gap-2 w-1/3">
          {title ? (
            <>
              <div className="w-8 bg-shark rounded-md">
                <MdEditNote size="full" className="text-gray-100" />
              </div>
              <h1 className="text-stone-800">{title}</h1>
            </>
          ) : (
            <>
              <div className="w-8 bg-shark rounded-md">
                <MdEditNote size="full" className="text-gray-100" />
              </div>
              <h1 className="text-stone-800">Nova anotação</h1>
            </>
          )}
        </div>
        <div className="">
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
        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={() => addNote(html, title)}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 bg-shark text-gray-100 hover:bg-shark-600"
          >
            <MdLibraryAdd />
            <p>ADICIONAR</p>
          </button>
          <button
            onClick={() => setShow(false)}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 border border-amaranth text-amaranth hover:bg-amaranth-600 hover:text-gray-100"
          >
            CANCELAR
          </button>
        </div>
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
        setMsg("Nota excluída");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
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
          setMsg("Nota editada");
        }
      } catch (error) {
        setErrorMsg("Houve algum erro, tente novamente");
      }
    };

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-100 p-10 py-5 rounded-md scaleup w-2/3 m-auto"
      >
        <div className="">
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
        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={() => editNote(targetNote)}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 bg-shark text-gray-100 hover:bg-shark-600"
          >
            SALVAR
          </button>
          <button
            onClick={() => setEdit(false)}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 border border-amaranth text-amaranth hover:bg-amaranth-600 hover:text-gray-100"
          >
            CANCELAR
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {card === 3 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800 mb-4">
            <h2 className="text-xl font-medium">ANOTAÇÕES</h2>
            <button
              className="rounded-md duration-200 p-1 text-stone-800 hover:bg-shark hover:text-gray-100"
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
              className={`p-2 mt-2 shadow-sm shadow-gray-600 duration-200 rounded-md  ${
                showNote === index
                  ? "border-stone-900 rounded-md"
                  : "cursor-pointer hover:bg-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-shark rounded-full"></div>
                  <h3
                    key={index}
                    className="italic font-medium text-lg text-stone-900"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="text-shark">
                  {showNote === index ? (
                    <button className="p-1 rounded-md cursor-pointer duration-200 hover:bg-shark hover:text-gray-100">
                      <AiFillCaretUp
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNote(false);
                        }}
                      />
                    </button>
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
                      onClick={() => {
                        setShow(true);
                        setElement(<NotePopup note={item} />);
                      }}
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
              className="flex items-center gap-1 text-gray-100 font-semibold p-1 px-3 rounded-full px-4 bg-shark duration-200 hover:text-white hover:bg-shark-700"
              onClick={(e) => {
                e.stopPropagation();
                setElement(<AddNewNote />);
                setShow(true);
              }}
            >
              <p>NOVA</p>
              <MdLibraryAdd />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col h-full justify-around items-center w-full`}
          onClick={() => {
            setCard(3);
          }}
        >
          <h2 className="text-xl font-medium">ANOTAÇÕES</h2>
          <p className="text-4xl font-thin">{myNotes.length}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setElement(<AddNewNote />);
              setShow(true);
            }}
            className="w-8 duration-200 p-1 rounded-md hover:bg-gray-100 hover:text-amaranth"
          >
            <MdLibraryAdd size="full" />
          </button>
        </div>
      )}
    </>
  );
}
