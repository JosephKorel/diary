import React, { useState } from "react";
import moment from "moment";
import { User } from "../../models/interfaces";

export default function RemindComponent({ user }: { user: User }): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [when, setWhen] = useState("");
  const [time, setTime] = useState("");
  const [degree, setDegree] = useState(1);

  const today = moment().format("DD/MM/YY");

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
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-blue-400 p-1 rounded-md">
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
}
