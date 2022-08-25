import React, { useEffect, useState } from "react";
import moment from "moment";
import MyModal from "./components/modal";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { MyNotes, MyTasks, User } from "../models/interfaces";
import Image from "next/image";
import { GetServerSideProps } from "next";

function Today({ notes, tasks }: { notes: MyNotes[]; tasks: MyTasks[] }) {
  const [user, setUser] = useState<User | null>(null);
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [myNotes, setMyNotes] = useState<MyNotes[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);

  const getUserData = async () => {
    const today = moment().format("DD/MM/YY");
    const currentUser: User = await JSON.parse(localStorage.getItem("user"));

    const todayNotes = notes.filter((note) => note.date === today);
    const todayTasks = tasks.filter((task) => task.date === today);

    const userTasks = todayTasks.filter(
      (task) => task.email === currentUser.email
    );
    const userNotes = todayNotes.filter(
      (note) => note.email === currentUser.email
    );

    setUser(currentUser);
    setMyTasks(userTasks);
    setMyNotes(userNotes);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const currentTasks = async (currentUser: User) => {
    const today = moment().format("DD/MM/YY");

    //Pega as tasks do dia de hoje
    const getTasks = await fetch(`/api/tasks/${currentUser.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const tasks = (await getTasks.json()) as { tasks: MyTasks[] };
      const todayTasks = tasks.tasks;
      const taskFilter = todayTasks.filter((item) => item.date === today);
      setMyTasks(taskFilter);
    } catch (error) {
      console.log(error);
    }
  };

  const currentNotes = async (currentUser: User) => {
    const today = moment().format("DD/MM/YY");
    //Pega as anotações do usuário
    const getNotes = await fetch("/api/notes/current_notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    });

    try {
      const notes = (await getNotes.json()) as { notes: MyNotes[] };
      const todayNotes = notes.notes.filter((note) => note.date === today);
      setMyNotes(todayNotes);
    } catch (error) {
      console.log(error);
    }
  };

  //Componente que lida com tarefas
  const MyTasksComponent = (): JSX.Element => {
    const completeTask = async (id: string) => {
      //Manda a req pra atualizar
      const updateTask = await fetch(`/api/tasks/[tasks]/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      try {
        if (updateTask.ok) {
          currentTasks(user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const deleteTask = async (id: string) => {
      //Manda a req pra deletar
      const updateTask = await fetch(`/api/tasks/[tasks]/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      try {
        if (updateTask.ok) {
          currentTasks(user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div className="p-20 bg-red-300 rounded-lg">
        <h2>Tarefas de hoje</h2>
        {myTasks.length > 0 ? (
          <>
            <h3>{myTasks.length}</h3>
          </>
        ) : (
          <>
            <p>Não há nenhuma tarefa ainda</p>
          </>
        )}
        <button
          onClick={() => {
            setElement(<AddNewTask />);
            setShow(true);
          }}
        >
          Adicionar
        </button>
        <button onClick={() => setShowTasks(!showTasks)}>Ver Tarefas</button>
        {showTasks && (
          <div>
            <ul>
              {myTasks.map((item, index) => (
                <li className="p-1 bg-slate-100" key={index}>
                  <p className={`${item.done ? "line-through" : ""}`}>
                    {item.task}
                  </p>
                  <button onClick={() => completeTask(item._id)}>
                    Concluída
                  </button>
                  <button onClick={() => deleteTask(item._id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  //Componente task do modal
  const AddNewTask = (): JSX.Element => {
    const [content, setContent] = useState("");

    const addTask = async (): Promise<void | null> => {
      if (!content) return null;
      const today = moment().format("DD/MM/YY");
      const newTask = {
        author: user.name,
        email: user.email,
        task: content,
        done: false,
        date: today,
      };

      //Adiciona uma nova tarefa
      const insert = await fetch(`/api/tasks/${user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      try {
        if (insert.status === 200) {
          currentTasks(user);
          setContent("");
          setShow(false);
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
        >
          <input
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            placeholder="Tarefa"
          />
        </form>
        <button onClick={addTask}>Adicionar</button>
        <button onClick={() => setShow(false)}>Cancelar</button>
      </div>
    );
  };

  //Componente de anotações
  const NotesComponent = (): JSX.Element => {
    const deleteNote = async (note: MyNotes) => {
      //Se houver imagens, deleta as imagens no storage
      if (note.media.length > 0) {
        note.media.forEach((item) => {
          const imgRef = ref(storage, `${note.email}/${item.name}`);
          deleteObject(imgRef);
        });
      }

      const handleDelete = await fetch("/api/notes/delete_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: note._id }),
      });

      try {
        if (handleDelete.ok) {
          currentNotes(user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
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
                  <p>{item.note}</p>
                  {item.media.length > 0 && (
                    <>
                      {item.media.map((image) => (
                        <Image src={image.url} width={100} height={100} />
                      ))}
                    </>
                  )}
                  <button onClick={() => deleteNote(item)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const AddNewNote = (): JSX.Element => {
    const [text, setText] = useState("");
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
    const addNote = async (): Promise<void | null> => {
      if (!text) return null;

      const today = moment().format("DD/MM/YY");

      //Houve upload de imagem
      if (file !== null) {
        const uploadedFiles = await addPhoto();

        const newNote = {
          author: user.name,
          email: user.email,
          note: text,
          media: uploadedFiles,
          date: today,
        };

        //Adiciona uma nova nota
        const insert = await fetch("/api/notes/new_note", {
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

      //Sem upload de imagem
      else {
        const newNote = {
          author: user.name,
          email: user.email,
          note: text,
          media: [],
          date: today,
        };

        //Adiciona uma nova nota
        const insert = await fetch("/api/tasks/new_note", {
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
        <textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Nova nota"
        />
        <button onClick={addNote}>Adicionar</button>
        <input type="file" multiple onChange={(e) => setFile(e.target.files)} />
        <button onClick={() => setShow(false)}>Cancelar</button>
      </div>
    );
  };

  return (
    <div>
      {show && <MyModal children={element} setShow={setShow} />}
      <h1>Dia {moment().format("DD/MM")}</h1>
      {user && (
        <div>
          <div>
            <img src={user.avatar}></img>
            <h2>Olá, {user.name}</h2>
          </div>
          <div className="flex justify-around items-center">
            {MyTasksComponent()}
            {NotesComponent()}
            <div className="p-20 bg-red-300 rounded-lg">
              <h2>Avaliação geral do dia</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Today;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const email = context.query.email;

  const fetchData = await fetch(`http://localhost:3000/api/user/${email}`);

  const fetchResult = await fetchData.json();

  try {
    const userData = fetchResult as {
      notes: MyNotes[];
      tasks: MyTasks[];
    };

    return { props: { notes: userData.notes, tasks: userData.tasks } };
  } catch (error) {
    console.log(error);
  }
};
