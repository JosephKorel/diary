import React, { useState } from "react";
import moment from "moment";
import { Evaluation, User } from "../../models/interfaces";

export default function DayEvaluation({
  user,
  dayVal,
  setDayVal,
  value,
}: {
  user: User;
  dayVal: Evaluation[];
  setDayVal: (data: Evaluation[]) => void;
  value: Date;
}): JSX.Element {
  const [evaluate, setEvaluate] = useState(0);
  const [edit, setEdit] = useState(false);

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
      body: JSON.stringify({ value: evaluate, date }),
    });
    try {
      if (handleEvaluation.ok) {
        setEvaluate(0);
        getTodayVal();
        console.log("Success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editEvaluation = async (date: string): Promise<void | null> => {
    const userEvaluation = user.dayEvaluation.slice();
    userEvaluation.forEach((item) => {
      if (item.date === date) {
        item.value = evaluate;
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
        setEvaluate(0);
        setEdit(false);
        getTodayVal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const humorSub = (mood: number): string => {
    if (mood === 0) return "Humor";
    else if (mood === 1) return "Muito triste";
    else if (mood <= 3) return "Triste";
    else if (mood === 4) return "Mais ou menos";
    else if (mood <= 6) return "Normal";
    else if (mood < 9) return "Feliz";
    else return "Extremamente feliz";
  };

  const yesterDayEvaluation = (
    <>
      {yesterdayVal.length > 0 ? (
        <>
          {edit ? (
            <>
              <p>Avalie o dia de ontem</p>
              <input
                value={evaluate}
                onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
              />
              <button onClick={() => editEvaluation(yesterday)}>
                Confirmar
              </button>
              <button onClick={() => setEdit(false)}>Cancelar</button>
            </>
          ) : (
            <div className="py-2 px-3 bg-amaranth shadow-lg rounded-full text-stone-100">
              <p className="font-semibold text-lg">
                ONTEM FOI UM DIA:{" "}
                <span className="uppercase">
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
          <p>Avalie o dia de ontem</p>
          <input
            value={evaluate}
            onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
          />
          <button onClick={() => evaluateDay(yesterday)}>Confirmar</button>
        </>
      )}
    </>
  );

  const todayEvaluation = (
    <>
      {currentDayVal.length > 0 ? (
        <>
          {edit ? (
            <>
              <p>Avalie o dia de hoje</p>
              <input
                value={evaluate}
                onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
              />
              <button onClick={() => editEvaluation(today)}>Confirmar</button>
              <button onClick={() => setEdit(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <p>Seu dia foi um {currentDayVal[0].value}</p>
              <button onClick={() => setEdit(true)}>Editar</button>
            </>
          )}
        </>
      ) : (
        <>
          <p>Avalie o dia de hoje</p>
          <input
            value={evaluate}
            onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
          />
          <button onClick={() => evaluateDay(today)}>Confirmar</button>
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
                <>
                  <p>Seu dia foi um {yesterdayVal[0].value}</p>
                </>
              ) : (
                <>{yesterDayEvaluation}</>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {currentDayVal[0] ? (
            <>
              <p>Seu dia foi um {currentDayVal[0].value}</p>
            </>
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
