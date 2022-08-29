import React, { useState, useEffect } from "react";
import moment from "moment";
import { DateInt, Evaluation, User } from "../../models/interfaces";

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

  const todayVal = user.dayEvaluation.filter((item) => item.date === today);

  useEffect(() => {
    setDayVal(todayVal);
  }, []);

  const getTodayVal = async () => {
    const fetchData = await fetch(
      `http://localhost:3000/api/user/${user.email}`
    );

    const fetchResult = await fetchData.json();

    const userEvaluation = fetchResult as { currUser: User };

    const todayFilter = userEvaluation.currUser.dayEvaluation.filter(
      (item) => item.date === today
    );

    setDayVal(todayFilter);
  };

  const evaluateDay = async (): Promise<void | null> => {
    const handleEvaluation = await fetch(`/api/user/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: evaluate, date: today }),
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

  const editEvaluation = async (): Promise<void | null> => {
    const userEvaluation = user.dayEvaluation.slice();
    userEvaluation.forEach((item) => {
      if (item.date === today) {
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

  return (
    <div>
      {currentTime >= "20:00" && moment(value).format("DD/MM/YY") === today ? (
        <>
          {dayVal.length > 0 ? (
            <>
              {edit ? (
                <>
                  <p>Avalie o dia de hoje</p>
                  <input
                    value={evaluate}
                    onChange={(e) => setEvaluate(Number(e.currentTarget.value))}
                  />
                  <button onClick={editEvaluation}>Confirmar</button>
                  <button onClick={() => setEdit(false)}>Cancelar</button>
                </>
              ) : (
                <>
                  <p>Seu dia foi um {dayVal[0].value}</p>
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
              <button onClick={evaluateDay}>Confirmar</button>
            </>
          )}
        </>
      ) : (
        <>
          {dayVal[0] ? (
            <>
              <p>Seu dia foi um {dayVal[0].value}</p>
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
