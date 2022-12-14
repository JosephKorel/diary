import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Evaluation,
  MyComments,
  MyNotes,
  MyReminder,
  MyTasks,
  User,
} from "../models/interfaces";
import { GetServerSideProps } from "next";
import CommentComponent from "../components/comments";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import {
  ImCrying2,
  ImSad2,
  ImConfused2,
  ImNeutral2,
  ImSmile2,
  ImHappy2,
} from "react-icons/im";
import { GiDualityMask } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import Alert from "../components/alert";
import Head from "next/head";
import DateViewComponent from "../components/dateView";
import MyNotesComponent from "../components/notes";
import RemindComponent from "../components/reminders";
import MyModal from "../components/modal";
import DayEvaluation from "../components/dayEval";
import MyTasksComp from "../components/tasks";

function Today({
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
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [myNotes, setMyNotes] = useState<MyNotes[]>([]);
  const [myComments, setMyComments] = useState<MyComments[]>([]);
  const [myReminders, setMyReminders] = useState<MyReminder[]>([]);
  const [element, setElement] = useState<JSX.Element>(null);
  const [show, setShow] = useState(false);
  const [dayVal, setDayVal] = useState<Evaluation[]>([]);
  const [value, onChange] = useState(new Date());
  const [card, setCard] = useState(0);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = "#D9DFFC";
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMsg("");
      setErrorMsg("");
    }, 2500);
  }, [msg, errorMsg]);

  const thisDay = moment(value).format("DD/MM/YY");
  const hour = moment().format("HH:mm");

  const currentDayTasks = myTasks.filter((task) => task.date === thisDay);
  const currentDayComments: MyComments[] = myComments.filter(
    (com) => com.date === thisDay
  );

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");

  //Checa se ?? o dia de hoje ou dias anteriores
  const presentOrPast = dayDiff >= 0 ? true : false;

  const getUserData = () => {
    if (dayVal.length === 0) {
      setDayVal(user.dayEvaluation);
    }

    setMyNotes(notes);
    setMyTasks(tasks);
    setMyComments(comments);
    setMyReminders(reminders);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const greetingMsg = (): string => {
    if (hour <= "12:00") {
      return "Bom dia";
    } else if (hour <= "18:00") {
      return "Boa tarde";
    } else return "Boa noite";
  };

  const dayView = (): string => {
    if (dayDiff === 0) {
      return "Hoje, " + thisDay;
    } else if (dayDiff === 1) {
      return "Ontem, " + thisDay;
    } else if (dayDiff === -1) {
      return "Amanh??, " + thisDay;
    } else return thisDay;
  };

  const currentTasks = async (currentUser: User): Promise<void> => {
    //Pega as tasks do dia de hoje
    const getTasks = await fetch(`/api/tasks/${currentUser.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const tasks = (await getTasks.json()) as { tasks: MyTasks[] };
      setMyTasks(tasks.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  const currentNotes = async (currentUser: User): Promise<void> => {
    //Pega as anota????es do usu??rio
    const getNotes = await fetch(`/api/notes/${currentUser.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const notes = (await getNotes.json()) as { notes: MyNotes[] };
      setMyNotes(notes.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const currentComments = async (currentUser: User): Promise<void> => {
    //Pega as anota????es do usu??rio
    const getComments = await fetch(`/api/comments/${currentUser.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const comments = (await getComments.json()) as { comments: MyComments[] };
      setMyComments(comments.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const currentReminders = async () => {
    const getReminders = await fetch(`/api/reminder/${user.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      const result = (await getReminders.json()) as { remind: MyReminder[] };
      setMyReminders(result.remind);
    } catch (error) {
      console.log(error);
    }
  };

  const humorAvg = (): number => {
    let total = 0;
    const evaluationAvg = currentDayComments.reduce((acc, curr) => {
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

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {show && (
        // eslint-disable-next-line
        <MyModal children={element} setShow={setShow} />
      )}
      <div className="pt-5 lg:pt-10">
        <div className="w-11/12 lg:w-2/3 m-auto flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between items-center font-serrat">
          <div className="p-2 lg:py-1 lg:px-6 text-stone-800 flex items-center gap-3 bg-gray-100 rounded-full shadow-lg self-start">
            <h1 className="text-base lg:text-xl font-light">{dayView()}</h1>
            <DateViewComponent
              dateProps={{ user, value, onChange, reminders }}
            />
          </div>
          <div className="flex flex-row justify-between items-center lg:flex-col lg:items-start gap-2">
            <DayEvaluation
              dayProps={{ user, dayVal, setDayVal, value, setMsg, setErrorMsg }}
            />
            <button className="p-1 text-sm lg:py-1 lg:px-3 rounded-md lg:rounded-full bg-shark text-gray-100 lg:text-base font-light self-start duration-200 hover:bg-shark-600">
              <Link
                href={{ pathname: "/user_stats", query: { email: user.email } }}
              >
                <a>VER MINHAS ESTAT??STICAS</a>
              </Link>
            </button>
          </div>
        </div>
        {user && (
          <div className="w-11/12 lg:w-5/6 m-auto">
            <div className="flex justify-center mt-2">
              <div className="border border-stone-800 rounded-full">
                <img
                  src={user.avatar}
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                ></img>
              </div>
            </div>
            {text ? (
              <div className="fade">
                <div className="flex justify-center">
                  <div className="w-full lg:w-1/2">
                    {presentOrPast && (
                      <CommentComponent
                        props={{
                          user,
                          myComments,
                          currentComments,
                          value,
                          setMsg,
                          text,
                          setText,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center fade">
                  <div className="w-full lg:w-1/2">
                    {dayDiff == 0 && (
                      <div>
                        <div className="text-center mb-1 text-lg lg:text-2xl font-light font-serrat">
                          <h1 className="italic">
                            {greetingMsg()},{" "}
                            <span className="font-medium">{user.name}</span>
                          </h1>
                          <h1 className="ml-2">
                            Gostaria de compartilhar algo?
                          </h1>
                        </div>
                        <input
                          placeholder="Escreva aqui"
                          value={text}
                          onChange={(e) => setText(e.currentTarget.value)}
                          className="p-2 px-4 rounded-full w-full text-lg block border outline-hidden border-gray-300 text-stone-800 bg-gray-100 duration-100 focus:outline-none focus:border-stone-800 hover:border-stone-800"
                        ></input>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:flex-row lg:justify-center lg:gap-10 flex flex-col items-center gap-4 pb-2 text-stone-800 relative z-0 fade mt-5 font-serrat">
                  <div
                    onClick={() => setCard(1)}
                    className={`w-full lg:w-[12%] p-3 duration-200 shadow-lg shadow-shark-300 text-white rounded-md relative  ${
                      card === 1
                        ? "lg:flex-1 bg-gray-100"
                        : "bg-scampi hover:scale-105 hover:bg-amaranth hover:shadow-amaranth-400 hover:drop-shadow-2xl h-44 cursor-pointer"
                    }`}
                  >
                    {card === 1 ? (
                      <div className="w-full">
                        <div className="flex justify-between items-center text-stone-800 mb-4">
                          <h2 className="text-xl font-medium">COMENT??RIOS</h2>
                          <button
                            className="rounded-md duration-200 p-1 text-stone-800 hover:bg-shark hover:text-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCard(0);
                            }}
                          >
                            <AiOutlineClose />
                          </button>
                        </div>
                        {currentDayComments.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col p-1 rounded-md text-stone-800"
                          >
                            <div className="flex flex-col ">
                              <p className="italic text-center text-base p-2 text-stone-900 shadow-sm shadow-gray-600 rounded-md">
                                {item.comment}
                              </p>
                              <div className="self-end flex items-center text-gray-200 gap-10 px-4 p-1 rounded-sm -translate-y-3 lg:-translate-y-4 rounded-l-sm rounded-br-md mr-2">
                                <div className="bg-shark p-1 rounded-md w-6 lg:w-8">
                                  <HumorIcon mood={item.mood} />
                                </div>
                                <p className="font-light text-xs p-1 lg:p-2 bg-shark rounded-md">
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-around items-center h-full">
                        <p className="text-lg lg:text-xl font-medium text-white">
                          COMENT??RIOS
                        </p>
                        <div className="w-12 h-16">
                          <HumorIcon mood={humorAvg()} />
                        </div>
                        {humorAvg() !== 0 ? (
                          <div className="flex justify-between items-center gap-1 w-full">
                            <div className="w-5">
                              <ImCrying2 size="full" />
                            </div>
                            <div className="w-full relative">
                              <div
                                className={`p-1 rounded-full bg-ronchi-600 absolute`}
                                style={{ width: `${humorAvg() * 10}%` }}
                              ></div>
                              <div className="p-1 rounded-full bg-gray-100"></div>
                            </div>
                            <div className="w-5">
                              <ImHappy2 size="full" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-5"></div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className={`w-full lg:w-[12%] p-3 shadow-lg shadow-shark-300 duration-200 text-white rounded-md  ${
                      card === 2
                        ? "lg:flex-1 bg-gray-100"
                        : "bg-scampi hover:scale-105 hover:bg-amaranth hover:shadow-amaranth-400 hover:drop-shadow-2xl h-44 cursor-pointer"
                    }`}
                  >
                    <MyTasksComp
                      taskProps={{
                        currentTasks,
                        user,
                        currentDayTasks,
                        value,
                        setShow,
                        setElement,
                        card,
                        setCard,
                        setMsg,
                        setErrorMsg,
                      }}
                    />
                  </div>
                  <div
                    className={`w-full lg:w-[12%] p-3 shadow-lg shadow-shark-300 duration-200 rounded-md 
              ${
                card === 3
                  ? "lg:flex-1 row-span-2 bg-gray-100"
                  : "bg-scampi hover:scale-105 hover:bg-amaranth hover:shadow-amaranth-400 hover:drop-shadow-2xl h-44 text-white cursor-pointer"
              }`}
                  >
                    <MyNotesComponent
                      noteProps={{
                        user,
                        myNotes,
                        currentNotes,
                        setShow,
                        setElement,
                        card,
                        setCard,
                        setMsg,
                        setErrorMsg,
                      }}
                    />
                  </div>
                  <div
                    className={`w-full lg:w-[12%] p-3 shadow-lg shadow-shark-300 duration-200 text-white rounded-md
              ${
                card === 4
                  ? "lg:flex-1 bg-gray-100"
                  : "hover:scale-105 bg-scampi hover:bg-amaranth hover:shadow-amaranth-400 hover:drop-shadow-2xl h-44 cursor-pointer"
              }`}
                  >
                    <RemindComponent
                      remindProps={{
                        user,
                        myReminders,
                        currentReminders,
                        setShow,
                        setElement,
                        card,
                        setCard,
                        setMsg,
                        setErrorMsg,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {<Alert msg={msg} errorMsg={errorMsg} />}
    </>
  );
}

export default Today;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { email } = context.query as { email: string };

  const fetchData = await fetch(
    `https://diary-seven.vercel.app/api/user/${email}`
  );

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
