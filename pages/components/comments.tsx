import React, { useEffect, useState } from "react";
import moment from "moment";
import { BiSad, BiMeh, BiHappyAlt } from "react-icons/bi";
import { MyComments, User } from "../../models/interfaces";
import { GiDualityMask } from "react-icons/gi";
import { BsHexagonFill } from "react-icons/bs";
import {
  ImCrying2,
  ImSad2,
  ImConfused2,
  ImNeutral2,
  ImSmile2,
  ImHappy2,
} from "react-icons/im";

export default function CommentComponent({
  user,
  myComments,
  currentComments,
  value,
}: {
  user: User;
  myComments: MyComments[];
  currentComments: (data: User) => void;
  value: Date;
}): JSX.Element {
  const [text, setText] = useState("");
  const [iconValue, setIconValue] = useState(0);
  const [hasChoosed, setHasChoosed] = useState(false);

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");

  const seingToday = dayDiff === 0 ? true : false;

  const addComment = async () => {
    const today = moment().format("DD/MM/YY");
    const time = moment().format("HH:mm");

    const newComment = {
      author: user.name,
      email: user.email,
      comment: text,
      mood: iconValue,
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
        setIconValue(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (value: number) => {
    if (hasChoosed && iconValue === value) {
      setHasChoosed(false);
      setIconValue(0);
    } else setHasChoosed(true);
  };

  const HumorIcon = ({ mood }: { mood: number }): JSX.Element => {
    if (mood === 0) return <GiDualityMask />;
    else if (mood === 1) return <ImCrying2 />;
    else if (mood <= 3) return <ImSad2 />;
    else if (mood === 4) return <ImConfused2 />;
    else if (mood <= 6) return <ImNeutral2 />;
    else if (mood < 9) return <ImSmile2 />;
    else return <ImHappy2 />;
  };
  return (
    <>
      <div className="p-10 bg-stone-800 text-gray-100 rounded-lg">
        {seingToday ? (
          <div className="text-center">
            <h2>Como você está neste momento?</h2>
            <input
              placeholder="Escreva aqui"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              className="w-full rounded-full p-2 text-stone-800"
            />
            <p>Escala de humor</p>
            <div className="flex justify-center items-center gap-5">
              <div className="flex gap-2">
                <BsHexagonFill
                  className={`${
                    iconValue > 0 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 0 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(1)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(1)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 1 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 1 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(2)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(2)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 2 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 2 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(3)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(3)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 3 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 3 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(4)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(4)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 4 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 4 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(5)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(5)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 5 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 5 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(6)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(6)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 6 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 6 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(7)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(7)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 7 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 7 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(8)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(8)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 8 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 8 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(9)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(9)}
                />
                <BsHexagonFill
                  className={`${
                    iconValue > 9 && "text-blue-500"
                  } text-white duration-200 ${
                    iconValue > 9 && hasChoosed && "text-indigo-700"
                  }`}
                  onMouseEnter={() => !hasChoosed && setIconValue(10)}
                  onMouseLeave={() => !hasChoosed && setIconValue(0)}
                  onClick={() => handleChoice(10)}
                />
              </div>
              <div>
                <HumorIcon mood={iconValue} />
              </div>
              <button onClick={addComment}>Confirmar</button>
            </div>
            {myComments.map((item, index) => (
              <div
                key={index}
                className="p-1 rounded-md bg-gray-100 flex justify-between items-center mt-1 text-stone-800"
              >
                <HumorIcon mood={item.mood} />
                <p className="italic">{item.comment}</p>
                <p className="font-bold">{item.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>Comentários: {myComments.length}</p>
            {myComments.map((item) => (
              <p className="italic">
                {item.comment} as <span className="font-bold">{item.time}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
