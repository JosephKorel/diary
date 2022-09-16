import React, { useState } from "react";
import moment from "moment";
import { Evaluation, User } from "../../models/interfaces";
import { MdEdit, MdCancel, MdCheck } from "react-icons/md";
import { BsHexagonFill } from "react-icons/bs";

interface DayComponent {
  dayProps: {
    user: User;
    dayVal: Evaluation[];
    setDayVal: (data: Evaluation[]) => void;
    value: Date;
    setMsg: (data: string) => void;
    setErrorMsg: (data: string) => void;
  };
}

export default function DayEvaluation({ dayProps }: DayComponent): JSX.Element {
  const [edit, setEdit] = useState(false);
  const [iconValue, setIconValue] = useState(0);
  const [hasChoosed, setHasChoosed] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const { user, dayVal, setDayVal, value, setMsg, setErrorMsg } = dayProps;

  const today = moment().format("DD/MM/YY");

  const currentTime = moment().format("HH:mm");

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");
  const yesterday = moment().subtract(1, "day").format("DD/MM/YY");

  const presentOrPast = dayDiff === 0 || dayDiff === 1 ? true : false;

  const currentDayVal = dayVal.filter(
    (item) => item.date === moment(value).format("DD/MM/YY")
  );

  const yesterdayVal = dayVal.filter((item) => item.date === yesterday);

  const getTodayVal = async () => {
    const fetchData = await fetch(
      `http://localhost:3000/api/user/${user.email}`
    );

    const fetchResult = await fetchData.json();

    const userEvaluation = fetchResult as { currUser: User };

    setDayVal(userEvaluation.currUser.dayEvaluation);
  };

  const evaluateDay = async (date: string): Promise<void | null> => {
    const handleEvaluation = await fetch(`/api/user/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: iconValue, date }),
    });
    try {
      if (handleEvaluation.ok) {
        setIconValue(0);
        getTodayVal();
        setIsEvaluating(false);
        setHasChoosed(false);
        setMsg("Avaliação registrada");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
    }
  };

  const editEvaluation = async (date: string): Promise<void | null> => {
    const userEvaluation = user.dayEvaluation.slice();
    userEvaluation.forEach((item) => {
      if (item.date === date) {
        item.value = iconValue;
      }
    });

    const handleEdit = await fetch(`/api/user/${user.email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newVal: userEvaluation }),
    });
    try {
      if (handleEdit.ok) {
        setIconValue(0);
        setEdit(false);
        getTodayVal();
        setHasChoosed(false);
        setMsg("Avaliação editada");
      }
    } catch (error) {
      setErrorMsg("Houve algum erro, tente novamente");
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

  const handleChoice = (value: number) => {
    if (hasChoosed && iconValue === value) {
      setHasChoosed(false);
      setIconValue(0);
    } else setHasChoosed(true);
  };

  const EvalIcons = (): JSX.Element => {
    return (
      <div className="flex gap-2">
        <BsHexagonFill
          className={`duration-200 ${
            iconValue > 0 ? "text-amaranth" : "text-gray-100"
          }  ${iconValue > 0 && hasChoosed && "text-amaranth"} `}
          onMouseEnter={() => !hasChoosed && setIconValue(1)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(1)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 1 ? "text-amaranth" : "text-gray-100"
          }  duration-200 ${iconValue > 1 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(2)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(2)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 2 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 2 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(3)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(3)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 3 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 3 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(4)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(4)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 4 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 4 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(5)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(5)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 5 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 5 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(6)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(6)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 6 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 6 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(7)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(7)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 7 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 7 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(8)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(8)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 8 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 8 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(9)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(9)}
          size={25}
        />
        <BsHexagonFill
          className={`${
            iconValue > 9 ? "text-amaranth" : "text-gray-100"
          } duration-200 ${iconValue > 9 && hasChoosed && "text-amaranth"}`}
          onMouseEnter={() => !hasChoosed && setIconValue(10)}
          onMouseLeave={() => !hasChoosed && setIconValue(0)}
          onClick={() => handleChoice(10)}
          size={25}
        />
      </div>
    );
  };

  const yesterDayEvaluation = (
    <>
      {yesterdayVal.length > 0 ? (
        <>
          {edit ? (
            <div className="py-2 px-3 bg-amaranth shadow-lg rounded-full text-stone-100">
              {/* <input
                value={evaluate}
                onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
              /> */}

              <button onClick={() => editEvaluation(yesterday)}>
                Confirmar
              </button>
              <button onClick={() => setEdit(false)}>Cancelar</button>
            </div>
          ) : (
            <div className="py-1 px-3 bg-amaranth shadow-lg rounded-full text-stone-100">
              <p className="font-light text-base">
                ONTEM FOI UM DIA:{" "}
                <span className="uppercase font-medium">
                  {humorSub(yesterdayVal[0].value)}
                </span>
              </p>
              {yesterdayVal[0].date === today && (
                <button onClick={() => setEdit(true)}>Editar</button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {isEvaluating ? (
            <div className="py-1 px-3 text-center bg-shark shadow-lg rounded-full text-stone-100 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <EvalIcons />
                <p className="font-light text-sm self-start ml-2">
                  ONTEM FOI UM DIA:{" "}
                  <span className="uppercase font-medium">
                    {humorSub(iconValue)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => evaluateDay(yesterday)}
                  className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-shark"
                >
                  <MdCheck size={20} />
                </button>
                <button
                  onClick={() => setIsEvaluating(false)}
                  className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-shark"
                >
                  <MdCancel size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="py-1 px-3 text-center text-gray-100 bg-amaranth shadow-lg rounded-full text-base duration-200 hover:bg-amaranth-600"
              onClick={() => setIsEvaluating(true)}
            >
              AVALIE O DIA DE ONTEM
            </button>
          )}
        </>
      )}
    </>
  );

  const todayEvaluation = (
    <>
      {currentDayVal.length > 0 ? (
        <>
          {edit ? (
            <div className="flex items-center gap-2 py-2 px-3 rounded-full bg-shark text-gray-100">
              <div className="flex flex-col gap-1">
                <EvalIcons />
                <p className="uppercase h-3 font-semibold text-sm px-2">
                  {humorSub(iconValue)}
                </p>
              </div>
              <button
                onClick={() => editEvaluation(today)}
                className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-amaranth"
              >
                <MdCheck size={20} />
              </button>
              <button
                onClick={() => setEdit(false)}
                className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-amaranth"
              >
                <MdCancel size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center text-base items-center gap-2 py-1 px-3 rounded-full bg-amaranth text-gray-100">
              <p className="uppercase font-semibold">
                Seu dia foi: {humorSub(currentDayVal[0].value)}
              </p>
              <button
                onClick={() => setEdit(true)}
                className="p-1 duration-200 rounded-md hover:text-amaranth hover:bg-gray-100"
              >
                <MdEdit />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {isEvaluating ? (
            <div className="py-1 px-3 text-center bg-shark shadow-lg rounded-full text-stone-100 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <EvalIcons />
                <p className="font-semibold text-sm self-start ml-2">
                  HOJE FOI UM DIA:{" "}
                  <span className="uppercase">{humorSub(iconValue)}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => evaluateDay(today)}
                  className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-shark"
                >
                  <MdCheck size={20} />
                </button>
                <button
                  onClick={() => setIsEvaluating(false)}
                  className="p-1 text-gray-100 duration-200 rounded-md hover:bg-gray-100 hover:text-shark"
                >
                  <MdCancel size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="py-1 px-3 text-center text-gray-100 bg-amaranth shadow-lg rounded-full font-semibold text-base duration-200 hover:bg-amaranth-600"
              onClick={() => setIsEvaluating(true)}
            >
              AVALIE O DIA DE HOJE
            </button>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      {presentOrPast ? (
        <>
          {dayDiff === 0 ? (
            <>
              {currentTime >= "20:00" ? (
                <>{todayEvaluation}</>
              ) : (
                <>{yesterDayEvaluation}</>
              )}
            </>
          ) : (
            <>
              {yesterdayVal[0] ? (
                <div className="py-1 px-3 rounded-full bg-amaranth text-gray-100">
                  <p className="uppercase font-semibold text-center">
                    Seu dia foi: {humorSub(yesterdayVal[0].value)}
                  </p>
                </div>
              ) : (
                <>{yesterdayVal}</>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {currentDayVal[0] ? (
            <div className="py-1 px-3 rounded-full bg-amaranth text-gray-100">
              <p className="uppercase font-semibold text-center">
                Seu dia foi: {humorSub(currentDayVal[0].value)}
              </p>
            </div>
          ) : (
            <>
              <p>Não há registros para este dia</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
