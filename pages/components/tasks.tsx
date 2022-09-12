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
    setMsg: (data: string) => void;
    setErrorMsg: (data: string) => void;
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
    setMsg,
    setErrorMsg,
  } = taskProps;

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");

  const myTasks = currentDayTasks.sort((a, b) => {
    if (a.done != b.done) {
      return !a.done && b.done ? -1 : 1;
    } else return b.degree - a.degree;
  });

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
        setMsg("Parabéns! Você concluiu sua tarefa!");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
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
        setMsg("Tarefa editada");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
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
        setMsg("Tarefa excluída");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
    }
  };

  const TaskPopup = ({ id }: { id: string }): JSX.Element => {
    return (
      <div className="w-[35%] m-auto scaleup pt-1 pb-4 px-1 bg-gray-100 border border-gray-400 rounded-md">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-2 border-gray-500 pb-1">
            <p className="text-2xl font-bold text-stone-800">EXCLUIR TAREFA</p>
            <button
              className="duration-200 text-gray-800 p-2 hover:bg-amaranth hover:text-gray-100 rounded-md"
              onClick={() => setShow(false)}
            >
              <AiOutlineClose size={25} />
            </button>
          </div>
          <div className="py-5 px-1">
            <p className="text-lg">Deseja mesmo excluir esta tarefa?</p>
          </div>
          <div className="flex items-center gap-2 px-1 mt-4">
            <button
              onClick={() => deleteTask(id)}
              className="font-semibold py-2 px-4 text-lg rounded-md bg-shark text-gray-100 duration-200 hover:bg-shark-600"
            >
              SIM
            </button>
            <button
              onClick={() => setShow(false)}
              className="font-semibold py-2 px-4 text-lg rounded-md bg-amaranth text-gray-100 duration-200 hover:bg-amaranth-600"
            >
              NÃO
            </button>
          </div>
        </div>
      </div>
    );
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
          setMsg("Tarefa adicionada");
        }
      } catch (error) {
        setErrorMsg("Houve algum erro, tente novamente");
      }
    };

    return (
      <div
        className="p-10 py-5 bg-gray-100 rounded-md w-2/3 m-auto scaleup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center text-2xl gap-1 mb-4">
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
                ? "bg-greeny text-gray-100 hover:bg-greeny-600"
                : "text-stone-800 bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => setDegree(1)}
          >
            <BsFlagFill className={degree === 1 ? "" : "text-greeny"} />
            <p>NORMAL</p>
          </button>
          <button
            className={`flex items-center text-base font-semibold gap-1 p-1 px-2 rounded-full duration-200 ${
              degree === 2
                ? "bg-ronchi text-stone-800 hover:bg-ronchi-600"
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
        return <HiFlag className="text-greeny" />;

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
              className="rounded-md duration-200 p-1 text-stone-800 hover:bg-shark hover:text-gray-100"
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
              {myTasks.map((item, index) => (
                <div className="flex flex-col" key={index}>
                  {edit === index ? (
                    <>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editTask(item._id);
                        }}
                        className="w-full p-1 text-stone-800 font-semibold text-lg italic shadow-sm shadow-black rounded-md"
                      >
                        <input
                          value={taskEdit}
                          onChange={(e) => setTaskEdit(e.currentTarget.value)}
                          className="p-1 px-3 rounded-md w-5/6 text-base block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-stone-800 hover:border-stone-800"
                        />
                      </form>
                      <div className="rounded-md -translate-y-4 flex justify-center gap-4 self-end bg-gray-200 border border-gray-500 text-stone-800 mr-4">
                        <button
                          onClick={() => editTask(item._id)}
                          className="p-2 duration-200 hover:bg-shark hover:text-gray-100"
                        >
                          <BsCheckCircleFill />
                        </button>
                        <button
                          onClick={() => setEdit(false)}
                          className="p-2 duration-200 hover:bg-amaranth hover:text-gray-100"
                        >
                          <MdCancel />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`p-2 shadow-sm shadow-black font-semibold text-lg italic rounded-md flex items-center border border-gray-600 gap-2 ${
                          item.done
                            ? "line-through text-gray-100 bg-stone-800"
                            : "bg-gray-100 text-stone-800"
                        }`}
                      >
                        <DegreeFlag degree={item.degree} />
                        <p>{item.task}</p>
                      </div>
                      <div className="rounded-md -translate-y-4 flex justify-center gap-2 self-end bg-gray-200 text-stone-800 border border-gray-500 mr-4">
                        {dayDiff >= 0 && (
                          <>
                            <button
                              onClick={() => completeTask(item._id)}
                              className="p-2 duration-200 hover:bg-shark hover:text-gray-100"
                            >
                              <BsCheckSquareFill />
                            </button>
                            {dayDiff === 0 && (
                              <button
                                onClick={() => {
                                  setEdit(index);
                                  setTaskEdit(item.task);
                                }}
                                className="p-2 duration-200 hover:bg-shark hover:text-gray-100"
                              >
                                <MdEdit />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setElement(<TaskPopup id={item._id} />);
                            setShow(true);
                          }}
                          className="p-2 duration-200 hover:bg-amaranth hover:text-gray-100"
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
                    <HiFlag className="text-greeny" />
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
                  className="flex items-center gap-1 text-gray-100 font-semibold p-1 rounded-full px-3 bg-shark duration-200 hover:text-white hover:bg-shark-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setElement(<AddNewTask />);
                    setShow(true);
                  }}
                >
                  <p>NOVA</p>
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
            {dayDiff <= 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setElement(<AddNewTask />);
                  setShow(true);
                }}
                className="w-8 duration-200 p-1 rounded-md hover:bg-gray-100 hover:text-amaranth"
              >
                <MdLibraryAdd size="full" />
              </button>
            ) : (
              <div className="p-2"></div>
            )}
          </div>
        </>
      )}
    </>
  );
}
