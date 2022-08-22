import React, { useEffect, useState } from "react";
import moment from "moment";
import MyModal from "./components/modal";

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

function Today() {
  const [task, setTask] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    currentTasks();
  }, []);

  const currentTasks = async () => {
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
      const taskFilter = todayTasks.filter((item) => item.email === user.email);
      setMyTasks(taskFilter);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    const today = moment().format("DD/MM/YY");
    const newTask = { author: user.name, email: user.email, task, date: today };

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
        setTask("Adicionada com sucesso");
        currentTasks();
      }
    } catch (error) {
      console.log(error);
      setTask("Erro");
    }
  };

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
        <input
          value={task}
          onChange={(e) => setTask(e.currentTarget.value)}
          placeholder="Tarefa"
        />
        <button
          onClick={() => {
            setElement(AddNewTask);
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

  const AddNewTask = (): JSX.Element => {
    return (
      <div
        className="bg-green-400 p-20 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          value={task}
          onChange={(e) => setTask(e.currentTarget.value)}
          placeholder="Tarefa"
        />
        <button onClick={addTask}>Adicionar</button>
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
            <div className="p-20 bg-red-300 rounded-lg">
              <h2>Anotações</h2>
            </div>
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
