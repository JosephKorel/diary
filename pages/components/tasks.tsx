import React, { useState } from "react";
import moment from "moment";
import MyModal from "./modal";
import { MyTasks, User } from "../../models/interfaces";

//Componente que lida com tarefas
export default function MyTasksComp({
  currentTasks,
  user,
  myTasks,
}: {
  currentTasks: (data: User) => void;
  user: User;
  myTasks: MyTasks[];
}): JSX.Element {
  const [showTasks, setShowTasks] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);

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

  return (
    <>
      {show && <MyModal children={element} setShow={setShow} />}
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
    </>
  );
}
