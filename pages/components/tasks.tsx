import React, { useState } from "react";
import moment from "moment";
import { MyTasks, User } from "../../models/interfaces";
import { BsFlagFill } from "react-icons/bs";
import { Calendar } from "react-calendar";
import { MdLibraryAdd } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

interface TaskComp {
  taskProps: {
    currentTasks: (data: User) => void;
    user: User;
    currentDayTasks: MyTasks[];
    value: Date;
    setShow: (data: boolean) => void;
    setElement: (data: JSX.Element) => void;
    card: number;
    setCard: (data: number) => void;
  };
}

//Componente que lida com tarefas
export default function MyTasksComp({ taskProps }: TaskComp): JSX.Element {
  const [showTasks, setShowTasks] = useState(false);
  const [taskEdit, setTaskEdit] = useState("");
  const [edit, setEdit] = useState<boolean | number>(false);

  const {
    currentTasks,
    user,
    currentDayTasks,
    value,
    setShow,
    setElement,
    card,
    setCard,
  } = taskProps;

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");

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
    const [showCal, setShowCal] = useState(false);
    const [date, setDate] = useState(new Date());

    const addTask = async (): Promise<void | null> => {
      if (!content) return null;
      const taskDate = moment(date).format("DD/MM/YY");
      const newTask = {
        author: user.name,
        email: user.email,
        task: content,
        done: false,
        degree,
        date: taskDate,
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
        <button
          onClick={() => {
            setShowCal(false);
            setDate(new Date());
          }}
        >
          Hoje
        </button>
        <button onClick={() => setShowCal(true)}>Outro dia</button>
        <div className={!showCal && ""}>
          <Calendar value={date} onChange={(value: Date) => setDate(value)} />
        </div>
        <button onClick={addTask}>Adicionar</button>
        <button onClick={() => setShow(false)}>Cancelar</button>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col justify-center items-center relative w-full`}
      onClick={() => {
        setCard(2);
        setShowTasks(true);
      }}
    >
      {card === 2 && (
        <button
          className="absolute top-0 right-1"
          onClick={(e) => {
            e.stopPropagation();
            setCard(0);
          }}
        >
          <AiOutlineClose />
        </button>
      )}
      <h2 className="text-xl font-bold">Tarefas</h2>
      <p className="text-3xl p-2">{currentDayTasks.length}</p>
      {dayDiff <= 0 && (
        <button
          onClick={() => {
            setElement(<AddNewTask />);
            setShow(true);
          }}
        >
          <MdLibraryAdd />
        </button>
      )}
      {card === 2 && (
        <div>
          <ul>
            {currentDayTasks.map((item, index) => (
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
                    {dayDiff === 0 && (
                      <>
                        <button onClick={() => completeTask(item._id)}>
                          Concluída
                        </button>
                        <button onClick={() => setEdit(index)}>Editar</button>
                      </>
                    )}
                    <button onClick={() => deleteTask(item._id)}>
                      Excluir
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
