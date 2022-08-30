import React, { useState } from "react";
import moment from "moment";
import MyModal from "./modal";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../firebase.config";
import { FileInt, MyNotes, User } from "../../models/interfaces";
import TextEditor from "./TextEditor/text_editor";

export default function MyNotesComponent({
  currentNotes,
  user,
  myNotes,
}: {
  currentNotes: (data: User) => void;
  user: User;
  myNotes: MyNotes[];
}): JSX.Element {
  const [showNotes, setShowNotes] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);
  const [edit, setEdit] = useState<boolean | number>(false);
  const [showNote, setShowNote] = useState<boolean | number>(false);

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
      {show && <MyModal children={element} setShow={setShow} />}
      <div className="p-20 bg-red-300 rounded-lg">
        <h2>Anotações: {myNotes.length}</h2>
        <button
          onClick={() => {
            setElement(<AddNewNote />);
            setShow(true);
          }}
        >
          Adicionar
        </button>
        <button onClick={() => setShowNotes(!showNotes)}>Ver anotações</button>
        {showNotes && (
          <div>
            <ul>
              {myNotes.map((item, index) => (
                <>
                  {showNote !== index ? (
                    <li key={index} onClick={() => setShowNote(index)}>
                      {item.title}
                    </li>
                  ) : (
                    <li key={index}>
                      {edit === index ? (
                        <>
                          <button onClick={() => setEdit(false)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.note }}
                          ></div>
                          <button onClick={() => deleteNote(item)}>
                            Excluir
                          </button>
                          <button
                            onClick={() => {
                              /* setEdit(index);
                              setNoteEdit(item.note); */
                              setShow(true);
                              setElement(
                                <NoteEditComponent targetNote={item} />
                              );
                            }}
                          >
                            Editar
                          </button>
                          <button onClick={() => setShowNote(false)}>
                            Minimizar
                          </button>
                        </>
                      )}
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
