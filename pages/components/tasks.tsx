import React, { useState } from "react";
import moment from "moment";
import { MyTasks, User } from "../../models/interfaces";
import {
  BsFlagFill,
  BsCheckSquareFill,
  BsEraserFill,
  BsCheckCircleFill,
} from "react-icons/bs";
import { Calendar } from "react-calendar";
import { MdLibraryAdd, MdEdit, MdCancel } from "react-icons/md";
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
    <>
      {card === 2 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800">
            <h2 className="text-xl font-bold">TAREFAS</h2>
            <button
              className=""
              onClick={(e) => {
                e.stopPropagation();
                setCard(0);
              }}
            >
              <AiOutlineClose />
            </button>
          </div>
          <div>
            {currentDayTasks.map((item, index) => (
              <>
                <div className="flex flex-col" key={index}>
                  {edit === index ? (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editTask(item._id);
                        }}
                        className="w-full p-1 text-stone-800 font-semibold text-lg italic shadow-md bg-gradient-to-r from-shark to-shark-300 rounded-md border-r-2 border-gray-800"
                      >
                        <input
                          value={taskEdit}
                          onChange={(e) => setTaskEdit(e.currentTarget.value)}
                          className="w-5/6 rounded-md p-1"
                        />
                      </form>
                      <div className="p-2 rounded-b-md -translate-y-4 flex justify-center gap-8 self-end bg-amaranth-600 text-white border-b-2 border-r-2 border-gray-800">
                        <button
                          onClick={() => editTask(item._id)}
                          className="duration-200 hover:text-gray-300"
                        >
                          <BsCheckCircleFill />
                        </button>
                        <button
                          onClick={() => setEdit(false)}
                          className="duration-200 hover:text-gray-300"
                        >
                          <MdCancel />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p
                        className={`p-2 border-gray-800 text-gray-100 shadow-md border-r-2 font-semibold text-lg italic rounded-md ${
                          item.done
                            ? "line-through bg-gradient-to-r from-scampi-600 to-scampi-900"
                            : "bg-gradient-to-r from-shark to-shark-300"
                        }`}
                      >
                        {item.task}
                      </p>
                      <div className="p-2 rounded-b-md -translate-y-4 flex justify-center gap-8 self-end bg-amaranth-600 text-white border-b-2 border-r-2 border-gray-800">
                        {dayDiff === 0 && (
                          <>
                            <button
                              onClick={() => completeTask(item._id)}
                              className="duration-200 hover:text-gray-300"
                            >
                              <BsCheckSquareFill />
                            </button>
                            <button
                              onClick={() => {
                                setEdit(index);
                                setTaskEdit(item.task);
                              }}
                              className="duration-200 hover:text-gray-300"
                            >
                              <MdEdit />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteTask(item._id)}
                          className="duration-200 hover:text-gray-300"
                        >
                          <BsEraserFill />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col justify-center items-center w-full`}
            onClick={() => {
              setCard(2);
              setShowTasks(true);
            }}
          >
            <h2 className="text-xl font-bold">TAREFAS</h2>
            <p className="text-3xl p-2">{currentDayTasks.length}</p>
            {dayDiff <= 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setElement(<AddNewTask />);
                  setShow(true);
                }}
                className="hover:text-ronchi"
              >
                <MdLibraryAdd size={25} />
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
