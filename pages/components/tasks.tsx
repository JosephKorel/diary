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
import { HiFlag } from "react-icons/hi";
import { CgGoogleTasks } from "react-icons/cg";

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

    const tomorrow = moment().add(1, "day");

    const isToday =
      moment(date).format("DD/MM/YY") === moment().format("DD/MM/YY")
        ? true
        : false;

    const isTomorrow =
      moment(date).format("DD/MM/YY") === tomorrow.format("DD/MM/YY")
        ? true
        : false;

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
        className="p-10 py-5 bg-gray-100 rounded-md w-2/3 m-auto scaleup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center text-2xl gap-1 mb-4 border-b-2 border-shark w-fit">
          {content ? (
            <>
              <div className="w-8">
                <CgGoogleTasks size="full" className="text-shark" />
              </div>
              <h1 className="text-stone-800">{content}</h1>
            </>
          ) : (
            <>
              <div className="w-8">
                <CgGoogleTasks size="full" className="text-shark" />
              </div>
              <h1 className="text-stone-800">Nova tarefa</h1>
            </>
          )}
        </div>
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
            className="p-2 px-4 rounded-full w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
          />
        </form>
        <div className="flex items-center mt-5 gap-2">
          <button
            className={`flex items-center text-base font-semibold gap-1 p-1 px-2 rounded-full duration-200 ${
              degree === 1
                ? "bg-amaranth text-gray-100 hover:bg-amaranth-600"
                : "text-stone-800 bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => setDegree(1)}
          >
            <BsFlagFill className={degree === 1 ? "" : "text-stone-800"} />
            <p>NORMAL</p>
          </button>
          <button
            className={`flex items-center text-base font-semibold gap-1 p-1 px-2 rounded-full duration-200 ${
              degree === 2
                ? "bg-amaranth text-gray-100 hover:bg-amaranth-600"
                : "text-stone-800 bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => setDegree(2)}
          >
            <BsFlagFill className={degree === 2 ? "" : "text-ronchi"} />
            <p>IMPORTANTE</p>
          </button>
          <button
            className={`flex items-center text-base font-semibold gap-1 p-1 px-2 rounded-full duration-200 ${
              degree === 3
                ? "bg-amaranth text-gray-100 hover:bg-amaranth-600"
                : "text-stone-800 bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => setDegree(3)}
          >
            <BsFlagFill className={degree === 3 ? "" : "text-amaranth"} />
            <p>URGENTE</p>
          </button>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={() => {
              setShowCal(false);
              setDate(new Date());
            }}
            className={`p-1 px-3 text-base font-semibold rounded-full duration-200 ${
              isToday
                ? "bg-shark text-gray-100"
                : "hover:bg-gray-300 text-stone-800"
            }`}
          >
            HOJE
          </button>
          <button
            onClick={() => {
              setShowCal(false);
              const today = new Date();
              const tomorrow = today.setDate(today.getDate() + 1);
              setDate(new Date(tomorrow));
            }}
            className={`p-1 px-3 text-base font-semibold rounded-full duration-200 ${
              isTomorrow
                ? "bg-shark text-gray-100"
                : "hover:bg-gray-300 text-stone-800"
            }`}
          >
            AMANHÃ
          </button>
          <button
            onClick={() => setShowCal(true)}
            className={`p-1 px-3 text-base font-semibold rounded-full duration-200 ${
              !isToday && !isTomorrow
                ? "bg-shark text-gray-100"
                : "hover:bg-gray-300 text-stone-800"
            }`}
          >
            OUTRO DIA
          </button>
        </div>
        <div className={!showCal ? "hidden" : "text-center mt-2"}>
          <Calendar value={date} onChange={(value: Date) => setDate(value)} />
        </div>
        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={addTask}
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

  const DegreeFlag = ({ degree }: { degree: number }): JSX.Element => {
    switch (degree) {
      case 1:
        return <HiFlag className="text-stone-800" />;

      case 2:
        return <HiFlag className="text-ronchi-600" />;

      case 3:
        return <HiFlag className="text-amaranth" />;

      default:
        break;
    }
  };

  return (
    <>
      {card === 2 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800 mb-4">
            <h2 className="text-xl font-bold">TAREFAS</h2>
            <button
              className="duration-200 p-1 hover:bg-stone-800 hover:text-gray-100 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                setCard(0);
              }}
            >
              <AiOutlineClose />
            </button>
          </div>
          {currentDayTasks.length > 0 ? (
            <div>
              {currentDayTasks.map((item, index) => (
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
                      <div
                        className={`p-2 border-gray-800 text-gray-100 shadow-md border-r-2 font-semibold text-lg italic rounded-md flex items-center gap-2 ${
                          item.done
                            ? "line-through bg-gradient-to-r from-scampi-600 to-scampi-900"
                            : "bg-gradient-to-r from-shark to-shark-300"
                        }`}
                      >
                        <DegreeFlag degree={item.degree} />
                        <p>{item.task}</p>
                      </div>
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
              ))}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4 text-stone-800">
                  <div className="flex items-center gap-1">
                    <HiFlag className="text-sotne-800" />
                    <p>NORMAL</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiFlag className="text-ronchi-600" />
                    <p>IMPORTANTE</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiFlag className="text-amaranth" />
                    <p>MUITO IMPORTANTE</p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 text-gray-100 font-semibold p-1 rounded-full px-4 bg-shark duration-200 hover:text-white hover:bg-shark-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setElement(<AddNewTask />);
                    setShow(true);
                  }}
                >
                  <p className="w-14">NOVA</p>
                  <MdLibraryAdd />
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none text-center text-base">
              <h1>Não há nenhuma tarefa para hoje</h1>
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className={`flex flex-col h-full justify-around items-center w-full`}
            onClick={() => {
              setCard(2);
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
                className="w-8 duration-200 p-1 rounded-md hover:bg-shark hover:text-gray-100"
              >
                <MdLibraryAdd size="full" />
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
