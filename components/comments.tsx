import React, { useEffect, useState } from "react";
import moment from "moment";
import { MyComments, User } from "../models/interfaces";
import { GiDualityMask } from "react-icons/gi";
import {
  BsHexagonFill,
  BsFillCheckCircleFill,
  BsArrowReturnLeft,
} from "react-icons/bs";
import {
  ImCrying2,
  ImSad2,
  ImConfused2,
  ImNeutral2,
  ImSmile2,
  ImHappy2,
  ImQuotesLeft,
  ImQuotesRight,
} from "react-icons/im";

interface CommentComp {
  props: {
    user: User;
    myComments: MyComments[];
    currentComments: (data: User) => void;
    value: Date;
    setMsg: (data: string) => void;
    text: string;
    setText: (data: string) => void;
  };
}

export default function CommentComponent({ props }: CommentComp): JSX.Element {
  const [iconValue, setIconValue] = useState(0);
  const [hasChoosed, setHasChoosed] = useState(false);

  const { user, myComments, currentComments, value, setMsg, text, setText } =
    props;

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");
  const hour = moment().format("HH:mm");

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
        setHasChoosed(false);
        setMsg("Comentário adicionado com sucesso!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (value: number) => {
    if (hasChoosed && iconValue === value) {
      setHasChoosed(false);
      setIconValue(0);
    } else {
      window.innerWidth < 650 && setIconValue(value);
      setHasChoosed(true);
    }
  };

  const humorSub = (mood: number): string => {
    if (mood === 0) return "";
    else if (mood === 1) return "Muito triste";
    else if (mood <= 3) return "Triste";
    else if (mood === 4) return "Mais ou menos";
    else if (mood <= 6) return "Normal";
    else if (mood < 9) return "Feliz";
    else return "Extremamente feliz";
  };

  const HumorIcon = ({ mood }: { mood: number }): JSX.Element => {
    if (mood === 0) return <GiDualityMask size="10%" />;
    else if (mood === 1) return <ImCrying2 size="8%" />;
    else if (mood <= 3) return <ImSad2 size="8%" />;
    else if (mood === 4) return <ImConfused2 size="8%" />;
    else if (mood <= 6) return <ImNeutral2 size="8%" />;
    else if (mood < 9) return <ImSmile2 size="8%" />;
    else return <ImHappy2 size="7%" />;
  };
  return (
    <>
      <div className="mt-1 lg:p-3 lg:mt-0 text-stone-800 font-serrat">
        {seingToday ? (
          <div className="bg-gray-100 p-2 lg:p-5 rounded-md shadow-lg shadow-stone-800">
            <input
              placeholder="Escreva aqui"
              value={text}
              autoFocus
              onChange={(e) => setText(e.currentTarget.value)}
              className="p-2 px-4 rounded-md w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-stone-800 hover:border-stone-800"
            />
            <div className="flex justify-center items-center gap-1">
              <ImQuotesLeft className="self-start" />
              <h1 className="text-xl italic">{text}</h1>
              <ImQuotesRight className="self-end" />
            </div>
            <div className={!text.length ? "hidden" : "mt-1 p-2"}>
              <p className="mt-2 text-xl lg:text-2xl font-semibold text-center text-stone-800">
                Como você está se sentindo?
              </p>
              <div className="flex justify-center items-center mt-2">
                <div className="flex gap-2">
                  <BsHexagonFill
                    className={`duration-200 ${
                      iconValue > 0 ? "text-amaranth" : "text-shark"
                    }  ${iconValue > 0 && hasChoosed && "text-amaranth"}`}
                    onMouseEnter={() => !hasChoosed && setIconValue(1)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(1)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 1 ? "text-amaranth" : "text-shark"
                    }  duration-200 ${
                      iconValue > 1 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(2)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(2)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 2 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 2 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(3)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(3)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 3 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 3 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(4)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(4)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 4 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 4 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(5)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(5)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 5 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 5 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(6)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(6)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 6 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 6 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(7)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(7)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 7 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 7 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(8)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(8)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 8 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 8 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(9)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(9)}
                    size={25}
                  />
                  <BsHexagonFill
                    className={`${
                      iconValue > 9 ? "text-amaranth" : "text-shark"
                    } duration-200 ${
                      iconValue > 9 && hasChoosed && "text-amaranth"
                    }`}
                    onMouseEnter={() => !hasChoosed && setIconValue(10)}
                    onMouseLeave={() => !hasChoosed && setIconValue(0)}
                    onClick={() => handleChoice(10)}
                    size={25}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center my-2 relative">
                <div className="flex justify-center items-center gap-2 p-2 rounded-md text-stone-700">
                  <HumorIcon mood={iconValue} />
                  <p className="text-xl font-semibold h-9 mt-1">
                    {humorSub(iconValue).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setText("")}
                  className="flex items-center gap-2 p-2 text-sm lg:text-base lg:p-2 lg:px-3 bg-amaranth rounded-full text-gray-100 duration-200 hover:bg-amaranth-600"
                >
                  <p className="font-semibold">VOLTAR</p>
                  <BsArrowReturnLeft />
                </button>
                <button
                  onClick={addComment}
                  className="flex items-center gap-2 p-2 text-sm lg:text-base lg:p-2 lg:px-3 bg-shark rounded-full text-gray-100 duration-200 hover:bg-shark-600"
                >
                  <p className="font-semibold">CONFIRMAR</p>
                  <BsFillCheckCircleFill />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>Comentários: {myComments.length}</p>
            {myComments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col  bg-gray-100 p-1 rounded-md text-stone-800"
              >
                <div className="flex items-center">
                  <HumorIcon mood={item.mood} />
                  <p className="italic text-center">{item.comment}</p>
                </div>
                <p className="font-bold self-start">{item.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
