import React, { useState } from "react";
import moment from "moment";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { FileInt, MyNotes, User } from "../models/interfaces";
import TextEditor from "./TextEditor/text_editor";
import { MdLibraryAdd, MdEdit, MdEditNote } from "react-icons/md";
import { BsArrowReturnLeft, BsEraserFill } from "react-icons/bs";
import {
  AiOutlineClose,
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillFolderOpen,
  AiFillFolder,
} from "react-icons/ai";

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
  const [onFolder, setOnFolder] = useState(-1);
  const [showFolder, setShowFolder] = useState("");

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

  const myFolders = myNotes.filter((item) => item.folders);

  const onlyNotes = myNotes.filter((item) => item.folder);
  const noteLength = onlyNotes.length;

  const userNotes = myNotes.filter((item) => item.folder === "");

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
      <div className="w-5/6 lg:w-[35%] m-auto pt-0 pb-4 px-1 bg-gray-100 border border-gray-400 rounded-md">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-2 border-stone-800 pb-1">
            <p className="text-2xl font-bold text-stone-800">
              EXCLUIR ANOTA????O
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
              className="font-semibold py-1 px-3 lg:py-2 lg:px-4 text-base lg:text-lg rounded-md bg-shark text-gray-100 duration-200 hover:bg-shark-600"
            >
              SIM
            </button>
            <button
              onClick={() => setShow(false)}
              className="font-semibold py-1 px-3 lg:py-2 lg:px-4 text-base lg:text-lg rounded-md bg-amaranth text-gray-100 duration-200 hover:bg-amaranth-600"
            >
              N??O
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddNewNote = (): JSX.Element => {
    const [file, setFile] = useState<null | any>(null);
    const [html, setHtml] = useState(
      "<p>Espero que voc?? esteja tendo um ??timo dia :D</p>"
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
        folder: showFolder,
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
        className="lg:p-10 lg:py-5 p-3 bg-gray-100 rounded-md w-11/12 lg:w-2/3 m-auto scaleup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-xl lg:text-2xl flex items-center gap-2 w-full lg:w-1/3">
          <div className="w-6 lg:w-8 bg-shark rounded-md">
            <MdEditNote size="full" className="text-gray-100" />
          </div>
          <h1 className="text-stone-800">{title ? title : "Nova Anota????o"}</h1>
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
        setMsg("Nota exclu??da");
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
        className="bg-gray-100 p-10 py-5 rounded-md scaleup w-2/3 m-auto font-serrat"
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
            onClick={() => {
              setEdit(false);
              setShow(false);
            }}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 border border-amaranth text-amaranth hover:bg-amaranth-600 hover:text-gray-100"
          >
            CANCELAR
          </button>
        </div>
      </div>
    );
  };

  const AddNewFolder = (): JSX.Element => {
    const [name, setName] = useState("");

    const newFolder = async () => {
      const folder = {
        email: user.email,
        folders: [name],
      };

      //Adiciona uma nova nota
      const insert = await fetch(`/api/notes/${user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(folder),
      });

      try {
        if (insert.ok) {
          currentNotes(user);
          setMsg("Pasta criada");
        }
      } catch (error) {
        setErrorMsg("Houve algum erro, tente novamente");
      }
    };

    return (
      <div
        className="bg-gray-100 p-10 py-5 scaleup rounded-md w-2/3 m-auto font-serrat"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <AiFillFolderOpen className="text-shark" size={30} />
          <h1 className="text-2xl">{name ? name : "Nova pasta"}</h1>
        </div>
        <input
          placeholder="Nome da pasta"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="p-2 px-4 mt-4 rounded-full w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
        />
        <button
          className="p-1 px-2 mt-6 rounded-md duration-200 text-base font-semibold bg-shark text-gray-100 hover:bg-shark-600"
          onClick={newFolder}
        >
          CONFIRMAR
        </button>
      </div>
    );
  };

  const folderNotes = (): MyNotes[] => {
    const filter = myNotes.filter((item) => item.folder === showFolder);
    return filter;
  };

  return (
    <>
      {card === 3 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800 mb-4">
            <h2 className="text-xl font-medium">ANOTA????ES</h2>
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
          <div>
            {myFolders.length > 0 ? (
              <div>
                {myFolders[0].folders.map((folder, index) => (
                  <div
                    key={index}
                    className="w-fit uppercase font-semibold text-sm lg:text-base py-1 px-3 flex items-center gap-2 rounded-full bg-ronchi text-stone-800 duration-200 hover:bg-ronchi-600 cursor-pointer"
                    onMouseEnter={() => setOnFolder(index)}
                    onMouseLeave={() => {
                      !showFolder && setOnFolder(-1);
                    }}
                    onClick={() => setShowFolder(folder)}
                  >
                    {onFolder === index ? (
                      <AiFillFolderOpen />
                    ) : (
                      <AiFillFolder />
                    )}

                    <p>{folder}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {showFolder ? (
            <div>
              <h2 className="mt-2 lg:mt-0 lg:text-xl font-semibold text-center border-b-2 border-gray-600 w-fit m-auto">
                {showFolder}
              </h2>
              {folderNotes().map((item, index) => (
                <div
                  key={index}
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
                        className="italic font-medium text-sm lg:text-lg text-stone-900"
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
              <div className="flex justify-between items-center mt-4">
                <button
                  className="p-1 text-sm rounded-md py-1 px-3 border border-gray-600 flex items-center gap-2 cursor-pointer duration-200 hover:bg-shark hover:text-gray-100"
                  onClick={() => {
                    setShowFolder("");
                    setOnFolder(-1);
                  }}
                >
                  <BsArrowReturnLeft />
                  <p>VER TODAS NOTAS</p>
                </button>
                <button
                  className="flex items-center gap-1 text-gray-100 font-semibold text-sm lg:text-base p-1 px-2 lg:px-4 rounded-full bg-shark duration-200 hover:text-white hover:bg-shark-700"
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
            <>
              {userNotes.map((item, index) => (
                <div
                  key={index}
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
                        className="italic font-medium lg:text-lg text-stone-900"
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
            </>
          )}
          {!showFolder && (
            <div className="lg:float-right mt-10 flex items-center justify-between lg:justify-start gap-2">
              <button
                className="flex items-center gap-1 text-gray-100 font-semibold text-sm p-1 px-2 lg:px-4 rounded-full bg-shark duration-200 hover:text-white hover:bg-shark-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setElement(<AddNewNote />);
                  setShow(true);
                }}
              >
                <p>NOVA</p>
                <MdLibraryAdd />
              </button>
              <button
                className="flex items-center gap-1 text-stone-800 font-semibold text-sm p-1 px-2 lg:px-4 rounded-full bg-ronchi duration-200 hover:text-black hover:bg-ronchi-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setElement(<AddNewFolder />);
                  setShow(true);
                }}
              >
                <p>NOVA PASTA</p>
                <MdLibraryAdd />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex flex-col h-full justify-around items-center w-full`}
          onClick={() => {
            setCard(3);
          }}
        >
          <h2 className="text-lg lg:text-xl font-medium">ANOTA????ES</h2>
          <p className="text-4xl font-thin">{noteLength}</p>
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
