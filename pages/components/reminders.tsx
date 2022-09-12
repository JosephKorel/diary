import React, { useState } from "react";
import moment from "moment";
import { MyReminder, User } from "../../models/interfaces";
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
  } = remindProps;

  const today = moment().format("DD/MM/YY");

  const hasPassed = (date: string) => {
    return today > date ? true : false;
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

      //Se o usuário tentar por um lembrete no passado
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
        }
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div
        className="w-2/3 m-auto py-5 px-10 rounded-md bg-gray-100 scaleup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 w-fit">
          {title.length > 0 ? (
            <>
              <div className="w-6">
                <BsFillCalendarEventFill size="full" className="text-shark" />
              </div>
              <h1 className="text-stone-800 text-xl">{title}</h1>
            </>
          ) : (
            <>
              <div className="w-6">
                <BsFillCalendarEventFill size="full" className="text-shark" />
              </div>
              <h1 className="text-stone-800 text-xl">Novo lembrete</h1>
            </>
          )}
        </div>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="p-2 rounded-md mt-4 w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
        />
        <textarea
          placeholder="Descrição"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          className="p-2 mt-2 rounded-md w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-shark hover:border-stone-800"
        />
        <div className="flex justify-center gap-5">
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
                <p className="text-lg font-semibold">Horário</p>
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
            <div className="flex flex-col gap-2">
              <button
                className={`flex items-center text-base gap-1 p-1 px-2 rounded-full duration-200 ${
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
                className={`flex items-center text-base gap-1 p-1 px-2 rounded-full duration-200 ${
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
                className={`flex items-center text-base gap-1 p-1 px-2 rounded-full duration-200 ${
                  degree === 3
                    ? "bg-amaranth text-gray-100 hover:bg-amaranth-600"
                    : "text-stone-800 bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => setDegree(3)}
              >
                <BsFlagFill className={degree === 3 ? "" : "text-amaranth"} />
                <p>Urgente</p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
      }
    } catch (error) {
      console.log(error);
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
            <h2 className="text-xl font-bold">LEMBRETES</h2>
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
          {myReminders.map((rmd, index) => (
            <div
              className={`mt-2 p-2 border border-stone-800 rounded-md duration-200  ${
                showRemind !== index && "cursor-pointer hover:bg-gray-300"
              }`}
              onClick={() => setShowRemind(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <RemindFlag degree={rmd.degree} />
                  <p className={`text-lg font-semibold text-stone-800`}>
                    {rmd.title}
                  </p>
                  {hasPassed(rmd.when) && (
                    <VscPassFilled className="text-shark" size={20} />
                  )}
                </div>
                <div>
                  {showRemind === index ? (
                    <AiFillCaretUp
                      className="text-stone-800 duration-200 cursor-pointer hover:text-amaranth"
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRemind(-1);
                      }}
                    />
                  ) : (
                    <AiFillCaretDown className="text-amaranth" size={20} />
                  )}
                </div>
              </div>
              {showRemind === index && (
                <div className="fade">
                  <p className="text-lg text-center mb-2 font-bold text-stone-800">
                    {rmd.content}
                  </p>
                  <div className="w-full p-[2px] rounded-full bg-stone-800 my-2"></div>
                  <div className="flex justify-center items-center gap-4">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-md  text-gray-200 ${
                        hasPassed(rmd.when) ? "bg-stone-700" : "bg-amaranth"
                      }`}
                    >
                      <BsFillCalendarEventFill />
                      <p className="font-semibold">{rmd.when}</p>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-shark text-gray-200">
                      <BsFillClockFill />
                      <p className="font-semibold">{rmd.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse">
                    <button
                      onClick={() => deleteRemind(rmd)}
                      className="p-1 rounded-md duration-200 text-stone-800 hover:text-gray-100 hover:bg-amaranth flex items-center gap-2 text-right"
                    >
                      <BsEraserFill />
                      <p className="font-semibold">EXCLUIR</p>
                    </button>
                  </div>
                </div>
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
                <HiFlag className="text-shark" />
                <p>IMPORTANTE</p>
              </div>
              <div className="flex items-center gap-1">
                <HiFlag className="text-amaranth" />
                <p>MUITO IMPORTANTE</p>
              </div>
            </div>
            <button
              className="flex items-center gap-1 text-gray-100 font-semibold p-1 px-3 rounded-full px-4 bg-shark duration-200 hover:text-white hover:bg-shark-700"
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
          <h2 className="text-xl font-bold">LEMBRETES</h2>
          <p className="text-3xl p-2">{myReminders.length}</p>
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
