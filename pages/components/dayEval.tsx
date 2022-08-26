import React, { useState, useEffect } from "react";
import moment from "moment";
import { User } from "../../models/interfaces";

interface Evaluation {
  value: number;
  date: string;
}

export default function DayEvaluation({ user }: { user: User }): JSX.Element {
  const [dayVal, setDayVal] = useState(0);
  const [edit, setEdit] = useState(false);
  const [todayEvaluation, setTodayEvaluation] = useState<Evaluation[]>([]);

  const today = moment().format("DD/MM/YY");
  const currentTime = moment().format("HH:mm");

  const todayVal = user.dayEvaluation.filter((item) => item.date === today);

  useEffect(() => {
    setTodayEvaluation(todayVal);
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

    setTodayEvaluation(todayFilter);
  };

  const evaluateDay = async (): Promise<void | null> => {
    const handleEvaluation = await fetch(`/api/user/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: dayVal, date: today }),
    });
    try {
      if (handleEvaluation.ok) {
        setDayVal(0);
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
        item.value = dayVal;
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
        setDayVal(0);
        setEdit(false);
        getTodayVal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {currentTime >= "20:00" && (
        <>
          {todayEvaluation.length > 0 ? (
            <>
              {edit ? (
                <>
                  <p>Avalie o dia de hoje</p>
                  <input
                    value={dayVal}
                    onChange={(e) => setDayVal(Number(e.currentTarget.value))}
                  />
                  <button onClick={editEvaluation}>Confirmar</button>
                  <button onClick={() => setEdit(false)}>Cancelar</button>
                </>
              ) : (
                <>
                  <p>Seu dia foi um {todayEvaluation[0].value}</p>
                  <button onClick={() => setEdit(true)}>Editar</button>
                </>
              )}
            </>
          ) : (
            <>
              <p>Avalie o dia de hoje</p>
              <input
                value={dayVal}
                onChange={(e) => setDayVal(Number(e.currentTarget.value))}
              />
              <button onClick={evaluateDay}>Confirmar</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
