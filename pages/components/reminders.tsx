import React, { useState } from "react";
import moment from "moment";
import { MyReminder, User } from "../../models/interfaces";
import MyModal from "./modal";

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
    const [when, setWhen] = useState("");
    const [time, setTime] = useState("");
    const [degree, setDegree] = useState(1);

    const addReminder = async () => {
      const remindDoc = {
        author: user.name,
        email: user.email,
        title,
        content,
        addedOn: today,
        when,
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
          setWhen("");
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
        <p>Dia</p>
        <input
          placeholder="DD/MM/YY"
          value={when}
          onChange={(e) => setWhen(e.currentTarget.value)}
        />
        <p>Horário</p>
        <input
          placeholder="HH:MM"
          value={time}
          onChange={(e) => setTime(e.currentTarget.value)}
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
            <button onClick={currentReminders}>Teste</button>
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
            <button onClick={currentReminders}>Teste</button>
          </div>
        )}
      </div>
    </div>
  );
}
