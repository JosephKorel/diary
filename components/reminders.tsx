import React, { useState } from "react";
import moment from "moment";
import { MyReminder, User } from "../models/interfaces";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdLibraryAdd } from "react-icons/md";
import { AiOutlineClose, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { HiFlag } from "react-icons/hi";
import {
  BsFillCalendarEventFill,
  BsFillClockFill,
  BsEraserFill,
  BsFlagFill,
} from "react-icons/bs";
import { VscPassFilled } from "react-icons/vsc";

interface RemindInt {
  remindProps: {
    user: User;
    myReminders: MyReminder[];
    currentReminders: () => void;
    setShow: (data: boolean) => void;
    setElement: (data: JSX.Element) => void;
    card: number;
    setCard: (data: number) => void;
    setMsg: (data: string) => void;
    setErrorMsg: (data: string) => void;
  };
}

export default function RemindComponent({
  remindProps,
}: RemindInt): JSX.Element {
  const [showRemind, setShowRemind] = useState(-1);

  const {
    user,
    myReminders,
    currentReminders,
    setShow,
    setElement,
    card,
    setCard,
    setMsg,
    setErrorMsg,
  } = remindProps;

  const today = moment().format("DD/MM/YY");

  const hasPassed = (date: string) => {
    return today > date ? true : false;
  };

  const reminder = myReminders.sort((a, b) => {
    if (hasPassed(a.when) != hasPassed(b.when)) {
      return !hasPassed(a.when) && hasPassed(b.when) ? -1 : 1;
    }
    return b.degree - a.degree;
  });

  const RemindPopup = ({ rmd }: { rmd: MyReminder }): JSX.Element => {
    return (
      <div className="font-serrat w-5/6 lg:w-[35%] m-auto scaleup pt-0 pb-4 px-1 bg-gray-100 border border-gray-400 rounded-md">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-2 border-stone-800 pb-1">
            <p className="text-lg lg:text-2xl font-bold text-stone-800">
              EXCLUINDO LEMBRETE
            </p>
            <button
              className="duration-200 text-xl text-gray-800 p-2 hover:bg-amaranth hover:text-gray-100 rounded-md"
              onClick={() => setShow(false)}
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className="py-5 px-1">
            <p className="text-sm lg:text-lg">
              Deseja mesmo excluir este lembrete?
            </p>
          </div>
          <div className="flex items-center gap-2 px-1 mt-4">
            <button
              onClick={() => deleteRemind(rmd)}
              className="font-semibold py-1 px-3 lg:py-2 lg:px-4 text-base lg:text-lg rounded-md bg-shark text-gray-100 duration-200 hover:bg-shark-600"
            >
              SIM
            </button>
            <button
              onClick={() => setShow(false)}
              className="font-semibold py-1 px-3 lg:py-2 lg:px-4 text-base lg:text-lg rounded-md bg-amaranth text-gray-100 duration-200 hover:bg-amaranth-600"
            >
              N??O
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NewRemind = (): JSX.Element => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("08:00");
    const [degree, setDegree] = useState(1);
    const [value, onChange] = useState(new Date());

    const hourFormat = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hour = event.currentTarget.value;
      const pattern = /^(\d{2})(\d{2})/;
      const replace = "$1:$2";
      const onFormat = hour.replace(pattern, replace);
      setTime(onFormat);
    };

    const addReminder = async (): Promise<void | null> => {
      const now = moment().startOf("day");
      const dayDiff = now.diff(moment(value).startOf("day"), "days");
      const rmdDay = moment(value).format("DD/MM/YY");

      //Se o usu??rio tentar por um lembrete no passado
      if (dayDiff > 0) return null;
      else if (time.length < 5) return null;

      const remindDoc = {
        author: user.name,
        email: user.email,
        title,
        content,
        addedOn: today,
        when: rmdDay,
        time,
        degree,
      };
      const newReminder = await fetch(`/api/reminder/${user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(remindDoc),
      });

      try {
        if (newReminder.ok) {
          setTitle("");
          setContent("");
          setTime("");
          currentReminders();
          setShow(false);
          setMsg("Lembrete adicinado");
        }
      } catch (error) {
        setErrorMsg("Houve algum erro, tente novamente");
      }
    };
    return (
      <div
        className="lg:p-10 lg:py-5 p-3 bg-gray-100 rounded-md w-11/12 lg:w-2/3 m-auto scaleup h-5/6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 w-fit">
          <div className="w-6">
            <BsFillCalendarEventFill size="full" className="text-shark" />
          </div>
          <h1 className="text-stone-800 text-xl">
            {title ? title : "Novo Lembrete"}
          </h1>
        </div>
        <input
          placeholder="T??tulo"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="p-2 rounded-md mt-4 w-full text-base :text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
        />
        <textarea
          placeholder="Descri????o"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          className="p-2 mt-2 rounded-md w-full text-base lg:text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
        />
        <div className="flex flex-col lg:flex-row justify-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold">Escolha o dia</p>
            <Calendar
              value={value}
              onChange={(value: Date) => onChange(value)}
            />
          </div>
          <div className="flex flex-col justify-around items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">Hor??rio</p>
                <BsFillClockFill />
              </div>
              <input
                placeholder="HH:MM"
                value={time}
                onChange={(e) => hourFormat(e)}
                maxLength={5}
                className="p-1 rounded-md w-1/2 text-base block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
              />
            </div>
            <div className="flex flex-row justify-between items-center lg:flex-col gap-2 mt-4 lg:mt-0">
              <button
                className={`flex items-center text-sm lg:text-base gap-1 p-1 px-2 rounded-full duration-200 ${
                  degree === 1
                    ? "bg-greeny text-gray-100 hover:bg-greeny-600"
                    : "text-stone-800 bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => setDegree(1)}
              >
                <BsFlagFill className={degree === 1 ? "" : "text-greeny"} />
                <p>Normal</p>
              </button>
              <button
                className={`flex items-center text-sm lg:text-base gap-1 p-1 px-2 rounded-full duration-200 ${
                  degree === 2
                    ? "bg-ronchi text-stone-800 hover:bg-ronchi-600"
                    : "text-stone-800 bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => setDegree(2)}
              >
                <BsFlagFill className={degree === 2 ? "" : "text-ronchi"} />
                <p>Importante</p>
              </button>
              <button
                className={`flex items-center text-sm lg:text-base gap-1 p-1 px-2 rounded-full duration-200 ${
                  degree === 3
                    ? "bg-amaranth text-gray-100 hover:bg-amaranth-600"
                    : "text-stone-800 bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => setDegree(3)}
              >
                <BsFlagFill className={degree === 3 ? "" : "text-amaranth"} />
                <p>Muito importante</p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <button
            onClick={addReminder}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 bg-shark text-gray-100 hover:bg-shark-600"
          >
            <MdLibraryAdd />
            <p>ADICIONAR</p>
          </button>
          <button
            onClick={() => setShow(false)}
            className="p-1 px-2 rounded-md duration-200 text-base font-semibold flex items-center gap-2 border border-amaranth text-amaranth hover:bg-amaranth-600 hover:text-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  const deleteRemind = async (rmd: MyReminder) => {
    const handleDelete = await fetch(`/api/reminder/[reminder]/${rmd._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (handleDelete.ok) {
        currentReminders();
        setMsg("Lembrete exclu??do");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
    }
  };

  const RemindFlag = ({ degree }: { degree: number }): JSX.Element => {
    switch (degree) {
      case 1:
        return <HiFlag className="text-greeny" />;

      case 2:
        return <HiFlag className="text-shark" />;

      case 3:
        return <HiFlag className="text-amaranth" />;

      default:
        break;
    }
  };

  return (
    <>
      {card === 4 ? (
        <div className="w-full">
          <div className="flex justify-between items-center text-stone-800 mb-4">
            <h2 className="text-xl font-medium">LEMBRETES</h2>
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
          {reminder.map((rmd, index) => (
            <div
              key={index}
              className={`mt-2 p-2 shadow-sm shadow-stone-700 rounded-md duration-200  ${
                showRemind !== index && "cursor-pointer hover:bg-gray-300"
              }`}
              onClick={() => setShowRemind(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <RemindFlag degree={rmd.degree} />
                  <p className={`lg:text-lg font-medium text-stone-800`}>
                    {rmd.title}
                  </p>
                  {hasPassed(rmd.when) && (
                    <VscPassFilled className="text-shark" size={20} />
                  )}
                </div>
                <div>
                  {showRemind === index ? (
                    <button className="p-1 text-shark rounded-md cursor-pointer duration-200 hover:bg-shark hover:text-gray-100">
                      <AiFillCaretUp
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRemind(-1);
                        }}
                      />
                    </button>
                  ) : (
                    <AiFillCaretDown className="text-shark" size={20} />
                  )}
                </div>
              </div>
              {showRemind === index && (
                <div className="fade mt-2 lg:mt-0">
                  <p className="lg:text-lg text-center mb-2 text-stone-800">
                    {rmd.content}
                  </p>
                  <div className="w-full p-[2px] rounded-full bg-stone-800 my-2"></div>
                  <div className="flex justify-center items-center gap-4">
                    <div
                      className={`flex items-center text-sm lg:text-base gap-2 p-2 rounded-md text-gray-200 ${
                        hasPassed(rmd.when) ? "bg-stone-700" : "bg-amaranth"
                      }`}
                    >
                      <BsFillCalendarEventFill />
                      <p className="font-light">{rmd.when}</p>
                    </div>
                    <div className="flex items-center text-sm lg:text-base gap-2 p-2 rounded-md bg-shark text-gray-200">
                      <BsFillClockFill />
                      <p className="font-light">{rmd.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse mt-4 lg:mt-0">
                    <button
                      onClick={() => {
                        setShow(true);
                        setElement(<RemindPopup rmd={rmd} />);
                      }}
                      className="p-1 px-2 rounded-md duration-200 text-sm bg-amaranth lg:bg-none text-gray-100 lg:text-base lg:text-stone-800 hover:text-gray-100 hover:bg-amaranth flex items-center gap-2 text-right"
                    >
                      <BsEraserFill />
                      <p className="font-semibold">EXCLUIR</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex lg:justify-between lg:items-center gap-4 lg:gap-0 flex-col mt-4">
            <div className="flex lg:items-center flex-col lg:flex-row gap-1 lg:gap-4 text-stone-800">
              <div className="flex items-center gap-1 text-sm">
                <HiFlag className="text-greeny" />
                <p>NORMAL</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <HiFlag className="text-shark" />
                <p>IMPORTANTE</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <HiFlag className="text-amaranth" />
                <p>MUITO IMPORTANTE</p>
              </div>
            </div>
            <button
              className="flex items-center self-start gap-1 text-gray-100 font-semibold p-1 px-3 rounded-full bg-shark duration-200 hover:text-white hover:bg-shark-700"
              onClick={(e) => {
                e.stopPropagation();
                setElement(<NewRemind />);
                setShow(true);
              }}
            >
              <p>NOVO</p>
              <MdLibraryAdd />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col justify-around items-center h-full w-full`}
          onClick={() => {
            setCard(4);
          }}
        >
          <h2 className="text-lg lg:text-xl font-medium">LEMBRETES</h2>
          <p className="text-4xl font-thin">{myReminders.length}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setElement(<NewRemind />);
              setShow(true);
            }}
            className="w-8 duration-200 p-1 rounded-md hover:bg-gray-100 hover:text-amaranth"
          >
            <MdLibraryAdd size="full" />
          </button>
        </div>
      )}
    </>
  );
}
