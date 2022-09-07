import React, { useState } from "react";
import moment from "moment";
import { MyReminder, User } from "../../models/interfaces";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdLibraryAdd } from "react-icons/md";
import { AiOutlineClose, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { HiFlag } from "react-icons/hi";

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

  const NewRemind = (): JSX.Element => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("");
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
        className="bg-blue-400 p-1 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <input
          placeholder="Descrição"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        />
        <div>
          <p>Dia</p>
          <Calendar value={value} onChange={(value: Date) => onChange(value)} />
        </div>
        <p>Horário</p>
        <input
          placeholder="HH:MM"
          value={time}
          onChange={(e) => hourFormat(e)}
          maxLength={5}
        />
        <div className="flex gap-4">
          <button onClick={() => setDegree(1)}>1</button>
          <button onClick={() => setDegree(2)}>2</button>
          <button onClick={() => setDegree(3)}>3</button>
          <button onClick={() => setDegree(4)}>4</button>
          <button onClick={() => setDegree(5)}>5</button>
        </div>
        <button onClick={addReminder}>Confirmar</button>
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
        return <HiFlag className="text-stone-800" />;

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
              className={`mt-2 p-2 border border-stone-800 rounded-md duration-200 text-stone-800  ${
                showRemind !== index && "cursor-pointer hover:bg-gray-300"
              }`}
              onClick={() => setShowRemind(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <RemindFlag degree={rmd.degree} />
                  <p className="text-lg font-semibold">{rmd.title}</p>
                </div>
                <div>
                  {showRemind === index ? (
                    <AiFillCaretUp
                      className="text-stone-800"
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
                <div>
                  {rmd.degree}
                  <button onClick={() => deleteRemind(rmd)}>Excluir</button>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-4 text-stone-800">
            <div className="flex items-center gap-1">
              <HiFlag className="text-sotne-800" />
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
        </div>
      ) : (
        <div
          className={`flex flex-col justify-center items-center w-full`}
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
            className="hover:text-ronchi"
          >
            <MdLibraryAdd size={25} />
          </button>
        </div>
      )}
      {/* <div className="bg-blue-400 p-1 rounded-md">
        {myReminders.length > 0 ? (
          <div>
            <ul>
              {myReminders.map((rmd) => (
                <li>
                  <p>{rmd.title}</p>
                  <button onClick={() => deleteRemind(rmd)}>Excluir</button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setShow(true);
                setElement(<NewRemind />);
              }}
            >
              Novo lembrete
            </button>
          </div>
        ) : (
          <div>
            <p>Você ainda não tem nenhum lembrete</p>
            <button
              onClick={() => {
                setShow(true);
                setElement(<NewRemind />);
              }}
            >
              Novo lembrete
            </button>
          </div>
        )}
      </div> */}
    </>
  );
}
