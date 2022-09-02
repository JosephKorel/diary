import React, { useState } from "react";
import moment from "moment";
import { MyReminder, User } from "../../models/interfaces";
import MyModal from "./modal";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function RemindComponent({
  user,
  myReminders,
  currentReminders,
}: {
  user: User;
  myReminders: MyReminder[];
  currentReminders: () => void;
}): JSX.Element {
  const [showRemind, setShowRemind] = useState(false);
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<JSX.Element | null>(null);

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

  return (
    <div>
      {show && <MyModal setShow={setShow} children={element} />}
      <div className="bg-blue-400 p-1 rounded-md">
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
      </div>
    </div>
  );
}
