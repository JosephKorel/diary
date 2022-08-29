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
import { MyNotes, User } from "../../models/interfaces";
import Image from "next/image";
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
  const [noteEdit, setNoteEdit] = useState("");

  const AddNewNote = (): JSX.Element => {
    const [text, setText] = useState("We should eat chocolate");
    const [file, setFile] = useState<null | any>(null);

    const addPhoto = async (): Promise<
      { name: string; url: string }[] | null
    > => {
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

    //Adiciona a nota
    const addNote = async (html: string): Promise<void | null> => {
      if (html === "") return null;

      const today = moment().format("DD/MM/YY");

      //Houve upload de imagem
      if (file !== null) {
        const uploadedFiles = await addPhoto();

        const newNote = {
          author: user.name,
          email: user.email,
          note: html,
          media: uploadedFiles,
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
          }
        } catch (error) {
          console.log(error);
        }
      }

      //Sem upload de imagem
      else {
        const newNote = {
          author: user.name,
          email: user.email,
          note: html,
          media: [],
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
            setText("");
            setShow(false);
          }
        } catch (error) {
          console.log(error);
        }
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
              text={text}
              addNote={addNote}
              file={file}
              setFile={setFile}
              addPhoto={addPhoto}
            />
          </div>
        </div>

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

  const editNote = async (note: MyNotes): Promise<void | null> => {
    if (noteEdit === "") return null;
    const handleEdit = await fetch(`/api/notes/[notes]/${note._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ edit: noteEdit }),
    });

    try {
      if (handleEdit.ok) {
        currentNotes(user);
        setEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
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
                <li key={index}>
                  {edit === index ? (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editNote(item);
                        }}
                      >
                        <input
                          value={noteEdit}
                          onChange={(e) => setNoteEdit(e.currentTarget.value)}
                        />
                      </form>
                      <button onClick={() => editNote(item)}>Confirmar</button>
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
                          setEdit(index);
                          setNoteEdit(item.note);
                        }}
                      >
                        Editar
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
