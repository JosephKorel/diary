import React, { useState } from "react";
import moment from "moment";
import MyModal from "./modal";
import { MyTasks, User } from "../../models/interfaces";
import { BsFlagFill } from "react-icons/bs";

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
  const [taskEdit, setTaskEdit] = useState("");
  const [edit, setEdit] = useState<boolean | number>(false);

  const completeTask = async (id: string) => {
    //Manda a req pra atualizar
    const updateTask = await fetch(`/api/tasks/[tasks]/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, action: "done" }),
    });

    try {
      if (updateTask.ok) {
        currentTasks(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (id: string): Promise<void | null> => {
    if (taskEdit === "") return null;

    //Manda a req pra atualizar a tarefa
    const handleEdit = await fetch(`/api/tasks/[tasks]/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, action: "edit", edit: taskEdit }),
    });

    try {
      if (handleEdit.ok) {
        currentTasks(user);
        setTaskEdit("");
        setEdit(false);
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
    const [degree, setDegree] = useState(1);

    const addTask = async (): Promise<void | null> => {
      if (!content) return null;
      const today = moment().format("DD/MM/YY");
      const newTask = {
        author: user.name,
        email: user.email,
        task: content,
        done: false,
        degree,
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
          <div className="flex gap-5">
            <div className="flex gap-1">
              <BsFlagFill onClick={() => setDegree(1)} />
              <p>Normal</p>
            </div>
            <div className="flex gap-1">
              <BsFlagFill onClick={() => setDegree(2)} />
              <p>Importante</p>
            </div>
            <div className="flex gap-1">
              <BsFlagFill onClick={() => setDegree(3)} />
              <p>Urgente</p>
            </div>
          </div>
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
        <h2>Tarefas</h2>
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
                  {edit === index ? (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editTask(item._id);
                        }}
                      >
                        <input
                          value={taskEdit}
                          onChange={(e) => setTaskEdit(e.currentTarget.value)}
                        />
                      </form>
                    </>
                  ) : (
                    <p className={`${item.done ? "line-through" : ""}`}>
                      {item.task}
                    </p>
                  )}

                  {edit === index ? (
                    <>
                      <button onClick={() => editTask(item._id)}>
                        Confirmar
                      </button>
                      <button onClick={() => setEdit(false)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => completeTask(item._id)}>
                        Concluída
                      </button>
                      <button onClick={() => deleteTask(item._id)}>
                        Excluir
                      </button>
                      <button onClick={() => setEdit(index)}>Editar</button>
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
