import React, { useEffect, useState } from "react";
import moment from "moment";
import MyModal from "./components/modal";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase.config";

interface User {
  name: string;
  email?: string;
  avatar?: string;
}

interface MyTasks {
  _id: string;
  author: string;
  email: string;
  task: string;
  date: string;
}

interface MyNotes {
  _id: string;
  author: string;
  email: string;
  note: string;
  date: string;
}

function Today() {
  const [user, setUser] = useState<User | null>(null);
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [myNotes, setMyNotes] = useState<MyNotes[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);

  const retrieveInfo = async () => {
    const currentUser: User = await JSON.parse(localStorage.getItem("user"));
    await currentTasks(currentUser.email);
    await currentNotes(currentUser.email);
    setUser(currentUser);
  };

  useEffect(() => {
    retrieveInfo();
  }, []);

  const currentTasks = async (email: string) => {
    //Pega as tasks do dia de hoje
    const getTasks = await fetch("/api/tasks/current_tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const tasks = (await getTasks.json()) as { tasks: MyTasks[] };
      const todayTasks = tasks.tasks;
      const taskFilter = todayTasks.filter((item) => item.email === email);
      setMyTasks(taskFilter);
    } catch (error) {
      console.log(error);
    }
  };

  const currentNotes = async (email: string) => {
    //Pega as tasks do dia de hoje
    const getNotes = await fetch("/api/tasks/current_notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const notes = (await getNotes.json()) as { notes: MyNotes[] };
      const todayNotes = notes.notes;
      const noteFilter = todayNotes.filter((item) => item.email === email);
      setMyNotes(noteFilter);
    } catch (error) {
      console.log(error);
    }
  };

  //Componente que lida com tarefas
  const MyTasksComponent = (): JSX.Element => {
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
              {myTasks.map((item) => (
                <li>{item.task}</li>
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

    const addTask = async () => {
      const today = moment().format("DD/MM/YY");
      const newTask = {
        author: user.name,
        email: user.email,
        task: content,
        date: today,
      };

      //Adiciona uma nova tarefa
      const insert = await fetch("/api/tasks/new_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      try {
        if (insert.status === 200) {
          currentTasks(user.email);
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

  const NotesComponent = (): JSX.Element => {
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
              {myNotes.map((item) => (
                <li>{item.note}</li>
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

    const addPhoto = async () => {
      const imgref = ref(storage, "images");

      try {
        await uploadBytes(imgref, file);
        console.log("Success");
      } catch (error) {
        console.log(error);
      }
    };

    //Adiciona a nota
    const addNote = async () => {
      const today = moment().format("DD/MM/YY");

      if (file) await addPhoto();

      const newNote = {
        author: user.name,
        email: user.email,
        note: text,
        date: today,
      };

      //Adiciona uma nova tarefa
      const insert = await fetch("/api/tasks/new_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      try {
        if (insert.ok) {
          currentNotes(user.email);
          setText("");
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
        <textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Nova nota"
        />
        <button onClick={addNote}>Adicionar</button>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
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
