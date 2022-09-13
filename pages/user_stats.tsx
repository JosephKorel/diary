import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  DayStats,
  MyComments,
  MyNotes,
  MyReminder,
  MyTasks,
  TimeSpanInt,
  User,
} from "../models/interfaces";
import React, { useState, useEffect } from "react";
import moment from "moment";
import DateViewComponent from "./components/dateView";
import { BsArrowReturnLeft } from "react-icons/bs";
import Semicircle from "./components/semicircle";
import {
  ImCrying2,
  ImSad2,
  ImConfused2,
  ImNeutral2,
  ImSmile2,
  ImHappy2,
} from "react-icons/im";
import { GiDualityMask } from "react-icons/gi";

function UserStats({
  user,
  notes,
  tasks,
  comments,
  reminders,
}: {
  user: User;
  notes: MyNotes[];
  tasks: MyTasks[];
  comments: MyComments[];
  reminders: MyReminder[];
}) {
  const today = moment().format("DD/MM/YY");
  const [value, onChange] = useState(new Date());
  const [time, setTime] = useState<TimeSpanInt>({
    when: "Hoje",
    date: today,
    difference: 0,
    onSpan: false,
  });
  const [mySpan, setMySpan] = useState<DayStats[]>([]);

  const router = useRouter();
  const spanLength = mySpan.length;

  const currentDay = moment(value).format("DD/MM/YY");

  const handleSubtract = (amount: number): number => {
    setTime({ ...time, onSpan: true });
    const today = new Date();
    const tomorrow = today.setDate(today.getDate() + 2);
    const fromTomorrow = new Date(tomorrow);
    const from = today.setDate(today.getDate() - amount);
    onChange(new Date(from));

    return from;
  };

  const thisDay = new Date();

  useEffect(() => {
    const from = thisDay.setDate(thisDay.getDate() - 30);
    handleDayChange(new Date(from));
  }, []);

  const todayHumorAvg = (): number => {
    let total = 0;
    const evaluationAvg = comments.reduce((acc, curr) => {
      total++;
      acc += curr.mood;
      return acc;
    }, 0);

    return total > 0 ? evaluationAvg / total : 0;
  };

  const HumorIcon = ({ mood }: { mood: number }): JSX.Element => {
    if (mood === 0) return <GiDualityMask size="full" />;
    else if (mood === 1) return <ImCrying2 size="full" />;
    else if (mood <= 3) return <ImSad2 size="full" />;
    else if (mood === 4) return <ImConfused2 size="full" />;
    else if (mood <= 6) return <ImNeutral2 size="full" />;
    else if (mood < 9) return <ImSmile2 size="full" />;
    else return <ImHappy2 size="full" />;
  };

  const UserComments = ({ period }: { period: number }): JSX.Element => {
    const dailyHumor = (index: number): number | null => {
      let humorValue: number = 0;
      if (!mySpan[index].values.length) return null;
      mySpan
        .slice(period)
        [index].values.forEach((value) => (humorValue += value));
      const humorAvg = (humorValue / mySpan[index].values.length).toFixed(1);
      return Number(humorAvg);
    };

    const humorSpanAverage = (): number => {
      let allValues: number[] = [];
      let valueSum = 0;

      mySpan.slice(period).forEach((item) => {
        allValues = allValues.concat(item.values);
      });

      allValues.forEach((val) => (valueSum += val));

      const finalAverage = (valueSum / allValues.length).toFixed(1);

      return Number(finalAverage);
    };

    const completitionPercentage = (): number => {
      let totalTasks = 0;
      let completedTasks = 0;

      mySpan.slice(period).forEach((item) => {
        totalTasks += item.tasks.total;
        completedTasks += item.tasks.completed;
      });

      if (totalTasks > 0) {
        const percentage = (completedTasks * 100) / totalTasks;
        return Number(percentage.toFixed(1));
      } else return NaN;
    };

    const spanEvaluation = (): number => {
      let total = 0;
      const evaluationAvg = mySpan.slice(period).reduce((acc, curr) => {
        if (curr.evaluation > 0) {
          total++;
          acc += curr.evaluation;
        }
        return acc;
      }, 0);

      return total > 0 ? evaluationAvg / total : 0;
    };

    const whichDay = () => {
      switch (period) {
        case 30:
          return "Hoje";

        case 27:
          return "Três dias atrás";

        default:
          break;
      }
    };

    console.log(period);

    return (
      <div className="bg-green-300 p-2 rounded-md">
        {mySpan.length > 0 ? (
          <div className="flex justify-around items-center">
            {mySpan.slice(period).map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center p-5 bg-indigo-700 rounded-md text-gray-200"
              >
                <p>{whichDay()}</p>
                <p>Dia: {item.date}</p>
                <p>Comentários: {item.values.length}</p>
                {dailyHumor(index) ? (
                  <p>Humor médio: {dailyHumor(index)}</p>
                ) : (
                  <p>Sem registros para este dia</p>
                )}
                <div>
                  {item.tasks.total !== 0 ? (
                    <p>
                      Tarefas completas: {item.tasks.completed} de{" "}
                      {item.tasks.total}
                    </p>
                  ) : (
                    <p>Sem tarefas para este dia</p>
                  )}
                </div>
                <div>
                  {item.evaluation >= 0 ? (
                    <p>Avaliação do dia: {item.evaluation}</p>
                  ) : (
                    <p>Sem avaliação para este dia</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div>
          {completitionPercentage() !== NaN ? (
            <p>
              Você completou {completitionPercentage()}% das tarefas propostas
            </p>
          ) : (
            <p>Sem tarefas para este período</p>
          )}
        </div>
        <div>Média de humor deste período: {humorSpanAverage()}</div>
        <div>Média de avaliação diária neste período: {spanEvaluation()}</div>
      </div>
    );
  };

  const TimeSpan = (): JSX.Element => {
    return (
      <div>
        <p>Período</p>
        <ul>
          <li onClick={() => handleSubtract(0)}>Hoje</li>
          <li onClick={() => handleSubtract(1)}>Ontem</li>
          <li onClick={() => handleSubtract(3)}>3 dias atrás</li>
          <li onClick={() => handleSubtract(7)}>1 semana atrás</li>
          <li onClick={() => handleSubtract(30)}>1 mês atrás</li>
        </ul>
      </div>
    );
  };

  const handleDayChange = (myvalue: Date): void => {
    const now = moment().startOf("day");
    const difference = now.diff(moment(myvalue).startOf("day"), "days");
    const date = currentDay;

    /* if (!time.onSpan) {
      getStatistics([time.date]);
      return;
    } */

    const timeSpan = timeSpanStatistics(difference, myvalue);
    getStatistics(timeSpan);

    /*  switch (difference) {
      case 0:
        setTime({
          when: "Hoje",
          date,
          difference,
          onSpan: false,
        });
        break;

      case 1:
        setTime({
          when: "Ontem",
          date,
          difference,
          onSpan: true,
        });
        break;

      case 3:
        setTime({
          when: "3 dias atrás",
          date,
          difference,
          onSpan: true,
        });
        break;

      case 7:
        setTime({
          when: "1 semana atrás",
          date,
          difference,
          onSpan: true,
        });
        break;

      case 30:
        setTime({
          when: "1 mês atrás",
          date,
          difference,
          onSpan: true,
        });
        break;
      default:
        setTime({ when: "Dia", date: currentDay, difference, onSpan: false });
        break;
    } */
  };

  const timeSpanStatistics = (dif: number, myvalue: Date): string[] => {
    let span: string[] = [];

    /* if (dif === 0 || dif === 1) {
      for (let i = 0; i <= dif; i++) {
        const currDay = moment(value).startOf("day");
        const nextDay = currDay.add(i, "day").format("DD/MM/YY");
        span.push(nextDay);
      }
      return span;
    } else {
      for (let i = 0; i < dif; i++) {
        const currDay = moment(value).startOf("day");
        const nextDay = currDay.add(i, "day").format("DD/MM/YY");
        span.push(nextDay);
      }
      return span;
    } */

    for (let i = 0; i <= dif; i++) {
      const currDay = moment(myvalue).startOf("day");
      const nextDay = currDay.add(i, "day").format("DD/MM/YY");
      span.push(nextDay);
    }

    return span;
  };

  const getStatistics = (span: string[]) => {
    let dayStats: DayStats[] = [];

    //Pega os valores de humor dos comentários
    const commentFilter = (date: string): number[] => {
      let values: number[] = [];
      const filter = comments.filter((item) => item.date === date);
      filter.length && filter.forEach((comment) => values.push(comment.mood));
      return values;
    };

    //Pega as tarefas do usuário
    const taskFilter = (date: string): { completed: number; total: number } => {
      let completedTasks = 0;
      const currentTasks = tasks.filter((item) => item.date === date);
      currentTasks.forEach((task) => {
        if (task.done) {
          completedTasks += 1;
        }
      });
      return { completed: completedTasks, total: currentTasks.length };
    };

    const evaluationFilter = (date: string): number => {
      let evaluation = 0;

      const dayFilter = user.dayEvaluation.filter((day) => day.date === date);

      //Se não houve avaliação do dia
      if (!dayFilter[0]) return -1;

      //Se houve
      evaluation += dayFilter[0].value;

      return evaluation;
    };

    span.forEach((date) => {
      const values = commentFilter(date);
      const tasks = taskFilter(date);
      const evaluation = evaluationFilter(date);
      dayStats.push({
        date,
        values,
        tasks,
        evaluation,
      });
    });

    setMySpan(dayStats);
  };

  return (
    <div className="h-screen bg-shark-100 pt-10">
      <div className="w-2/3 m-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 p-2 px-3 bg-amaranth rounded-full text-gray-100 duration-200 hover:bg-amaranth-600"
        >
          <p className="font-semibold">VOLTAR</p>
          <BsArrowReturnLeft />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-36 m-auto">
          <Semicircle
            children={
              <div className="rounded-full">
                <img
                  src={user.avatar}
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                ></img>
              </div>
            }
            percentage={todayHumorAvg() * 10}
          />
        </div>
        <div className="w-10">
          <HumorIcon mood={todayHumorAvg()} />
        </div>
      </div>
      <div>
        <div className="flex gap-10">
          <TimeSpan />
          <DateViewComponent
            dateProps={{ user, value, onChange, setTime, reminders }}
          />
        </div>
        <p>
          {time.when} <span>({time.date})</span>
        </p>
      </div>
      <UserComments period={mySpan.length - 1} />
      <UserComments period={mySpan.length - 3} />
      {/*  {mySpan.length > 0 ? (
        <>
          {mySpan.slice(-1)[0].date == today ? (
            <UserComments period={mySpan.length - 1} />
          ) : (
            <>Carregando</>
          )}
        </>
      ) : (
        <></>
      )} */}
    </div>
  );
}

export default UserStats;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { email } = context.query as { email: string };

  const fetchData = await fetch(`http://localhost:3000/api/user/${email}`);

  const fetchResult = await fetchData.json();

  try {
    const userData = fetchResult as {
      currUser: User;
      notes: MyNotes[];
      tasks: MyTasks[];
      comments: MyComments[];
      reminders: MyReminder[];
    };

    return {
      props: {
        user: userData.currUser,
        notes: userData.notes,
        tasks: userData.tasks,
        comments: userData.comments,
        reminders: userData.reminders,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
