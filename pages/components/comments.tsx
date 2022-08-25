import React, { useEffect, useState } from "react";
import moment from "moment";
import { BiSad, BiMeh, BiHappyAlt } from "react-icons/bi";
import { MyComments, User } from "../../models/interfaces";

export default function CommentComponent({
  user,
  myComments,
  currentComments,
}: {
  currentComments: (data: User) => void;
  user: User;
  myComments: MyComments[];
}): JSX.Element {
  const [text, setText] = useState("");
  const [moodValue, setMoodValue] = useState("");
  const addComment = async () => {
    const today = moment().format("DD/MM/YY");
    const time = moment().format("HH:mm");

    const newComment = {
      author: user.name,
      email: user.email,
      comment: text,
      mood: Number(moodValue),
      time,
      date: today,
    };

    const insert = await fetch(`/api/comments/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    try {
      if (insert.ok) {
        currentComments(user);
        setText("");
        setMoodValue("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="p-20 bg-red-300 rounded-lg">
        <h2>Como você está neste momento?</h2>
        <input
          placeholder="Escreva aqui"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <p>Humor</p>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <BiSad />
            <p>0~3 - Triste</p>
          </div>
          <div className="flex flex-col">
            <BiMeh />
            <p>4~6 - Normal</p>
          </div>
          <div className="flex flex-col">
            <BiHappyAlt />
            <p>7~10 - Feliz</p>
          </div>
        </div>
        <input
          placeholder="Digite aqui"
          value={moodValue}
          onChange={(e) => setMoodValue(e.currentTarget.value)}
        />
        <button onClick={addComment}>Confirmar</button>
        <p>Comentários: {myComments.length}</p>
        {myComments.map((item) => (
          <p className="italic">
            {item.comment} as <span className="font-bold">{item.time}</span>
          </p>
        ))}
      </div>
    </>
  );
}
