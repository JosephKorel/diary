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
import Head from "next/head";

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

  const HumorIcon = ({ mood }: { mood: number }): JSX.Element => {
    if (mood === 0) return <GiDualityMask size="full" />;
    else if (mood === 1) return <ImCrying2 size="full" />;
    else if (mood <= 3) return <ImSad2 size="full" />;
    else if (mood === 4) return <ImConfused2 size="full" />;
    else if (mood <= 6) return <ImNeutral2 size="full" />;
    else if (mood < 9) return <ImSmile2 size="full" />;
    else return <ImHappy2 size="full" />;
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

  const CommentAndTaskStats = (): JSX.Element => {
    const commentStats: { [val: number]: number } = mySpan.reduce(
      (curr, acc): { [val: number]: number } => {
        acc.values.forEach((val) => {
          if (curr[val]) {
            return { ...curr, [val]: curr[val]++ };
          } else {
            curr = { ...curr, [val]: 1 };
            return curr;
          }
        });
        return curr;
      },
      {}
    );

    let total = 0;
    Object.values(commentStats).forEach((val: number) => (total += val));

    const commentsSort = Object.entries(commentStats).sort((a, b) => {
      return b[1] - a[1];
    });

    let commentObj = {} as { [humor: string]: number };

    commentsSort.forEach((item) => {
      let humor = humorSub(Number(item[0]));
      if (commentObj[humor]) {
        commentObj = { ...commentObj, [humor]: commentObj[humor] + item[1] };
      } else commentObj = { ...commentObj, [humor]: item[1] };
    });

    const comments = Object.entries(commentObj).sort((a, b) => {
      return b[1] - a[1];
    });

    const commentPercentage = (value: number): number => {
      return +((value * 100) / total).toFixed(1);
    };

    return (
      <div className="bg-scampi-600 rounded-md shadow-sm shadow-scampi-400 p-3 text-gray-100 self-start">
        <div className="flex flex-col gap-2">
          {comments.slice(0, 3).map((item, index) => (
            <p
              key={index}
              className="text-lg text-center rounded-md py-4 px-6 bg-gray-100 text-stone-800 shadow-md shadow-gray-600"
            >
              {index === 2 && "Apenas"}{" "}
              <span className="font-semibold italic">
                {commentPercentage(item[1])}%
              </span>{" "}
              dos seus comentários são do tipo:{" "}
              <span className="font-bold">{item[0]}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  const UserComments = ({
    from,
    until,
  }: {
    from: number;
    until: number;
  }): JSX.Element => {
    const dailyHumor = (index: number): number | null => {
      let humorValue: number = 0;
      if (!mySpan[index].values.length) return null;
      mySpan
        .slice(from, until)
        [index].values.forEach((value) => (humorValue += value));
      const humorAvg = (humorValue / mySpan[index].values.length).toFixed(1);
      return Number(humorAvg);
    };

    const humorSpanAverage = (): number => {
      let allValues: number[] = [];
      let valueSum = 0;

      mySpan.slice(from, until).forEach((item) => {
        allValues = allValues.concat(item.values);
      });

      allValues.forEach((val) => (valueSum += val));

      const finalAverage = (valueSum / allValues.length).toFixed(1);

      return Number(finalAverage);
    };

    const taskStats = (): number[] => {
      let totalTasks = 0;
      let completedTasks = 0;
      mySpan.slice(from, until).forEach((item) => {
        totalTasks += item.tasks.total;
        completedTasks += item.tasks.completed;
      });

      return [totalTasks, completedTasks];
    };

    const completitionPercentage = (): number => {
      let totalTasks = 0;
      let completedTasks = 0;
      mySpan.slice(from, until).forEach((item) => {
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
      const evaluationAvg = mySpan.slice(from, until).reduce((acc, curr) => {
        if (curr.evaluation > 0) {
          total++;
          acc += curr.evaluation;
        }
        return acc;
      }, 0);

      return total > 0 ? evaluationAvg / total : 0;
    };

    const whichDay = () => {
      switch (from) {
        case 30:
          return "Hoje";

        case 27:
          return "Últimos três dias";

        case 23:
          return "Última semana";

        case 0:
          return "Último mês";
        default:
          break;
      }
    };

    return (
      <div className="bg-gradient-to-b from-scampi-300 to-scampi p-2 rounded-md shadow-md shadow-scampi-600">
        {mySpan.length > 0 ? (
          <div className="p-2 pt-0">
            <div className="flex justify-center">
              <p className="font-bold uppercase shadow-md shadow-gray-600 -translate-y-6 text-2xl rounded-md bg-gray-200 text-stone-800 py-1 px-4 w-fit">
                {whichDay()}
              </p>
            </div>
            {/* {from != 30 ? (
              <p className="text-center italic text-sm">
                {mySpan.slice(from, until)[0].date} ~{" "}
                {mySpan.slice(from, until).slice(-1)[0].date}
              </p>
            ) : (
              <p className="text-center italic text-sm">
                {mySpan.slice(from, until)[0].date}
              </p>
            )} */}
            <div className="flex flex-col justify-around">
              <div className="flex flex-col gap-4 items-center text-amaranth">
                <div className="w-full flex flex-col justify-center relative bg-amaranth-300 rounded-md">
                  <div
                    className={`p-1 h-full rounded-md bg-amaranth absolute`}
                    style={{ width: `${humorSpanAverage() * 10}%` }}
                  ></div>
                  <p className="text-xl self-center mb-1 rounded-md py-1 px-2 text-gray-200 relative z-10">
                    HUMOR
                  </p>
                  <p className="text-center uppercase text-lg text-gray-100 py-1 px-3 rounded-full font-light italic relative z-10">
                    {humorSub(humorSpanAverage())}
                  </p>
                </div>
                <div className="w-full flex flex-col justify-center relative bg-shark-300 rounded-md">
                  <div
                    className={`p-1 h-full rounded-md bg-shark absolute`}
                    style={{ width: `${completitionPercentage()}%` }}
                  ></div>
                  <p className="text-xl self-center font-semibold mb-1 rounded-md py-1 px-2 text-gray-200 relative z-10">
                    TAREFAS
                  </p>
                  <p className="text-center uppercase text-lg text-gray-100 py-1 px-3 rounded-full font-light relative z-10 italic">
                    {completitionPercentage()}% COMPLETAS
                  </p>
                </div>
                {spanEvaluation() ? (
                  <div className="w-full flex flex-col justify-center relative bg-greeny-300 rounded-md">
                    <div
                      className={`p-1 h-full rounded-md bg-greeny absolute`}
                      style={{ width: `${spanEvaluation() * 10}%` }}
                    ></div>
                    <p className="text-xl self-center font-semibold mb-1 rounded-md py-1 px-2 text-gray-200 relative z-10">
                      NOTA DO DIA
                    </p>
                    <p className="text-center uppercase text-lg text-gray-100 py-1 px-3 rounded-full font-light relative z-10 italic">
                      {spanEvaluation().toFixed(1)}
                    </p>
                  </div>
                ) : (
                  <div className="absolute">
                    {/* <p className="text-lg text-center font-semibold mb-1 bg-greeny rounded-full p-1 px-3 text-gray-100">
                    NOTA DO DIA
                  </p> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
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

    const timeSpan = timeSpanStatistics(difference, myvalue);
    getStatistics(timeSpan);
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
    <div className="h-screen bg-shark-100 py-10 font-serrat">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="w-2/3 m-auto flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 p-2 px-3 bg-amaranth rounded-full text-gray-100 duration-200 hover:bg-amaranth-600 absolute left-0 top-0"
        >
          <p className="font-semibold">VOLTAR</p>
          <BsArrowReturnLeft />
        </button>
        <img
          src={user.avatar}
          referrerPolicy="no-referrer"
          className="rounded-full"
        ></img>
      </div>
      {/* <div>
        <div className="flex gap-10">
          <TimeSpan />
          <DateViewComponent
            dateProps={{ user, value, onChange, setTime, reminders }}
          />
        </div>
        <p>
          {time.when} <span>({time.date})</span>
        </p>
      </div> */}
      <div className="w-[70%] m-auto flex justify-between items-center mt-5">
        <div className="grid grid-cols-2 grid-rows-2 gap-8">
          <UserComments from={mySpan.length - 1} until={mySpan.length} />
          <UserComments from={mySpan.length - 4} until={mySpan.length - 1} />
          <UserComments from={mySpan.length - 8} until={mySpan.length - 1} />
          <UserComments from={0} until={mySpan.length} />
        </div>
        <CommentAndTaskStats />
      </div>
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
