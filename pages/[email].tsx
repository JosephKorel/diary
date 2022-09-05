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
import MyTasksComp from "./components/tasks";
import MyNotesComponent from "./components/notes";
import CommentComponent from "./components/comments";
import DayEvaluation from "./components/dayEval";
import "react-calendar/dist/Calendar.css";
import DateViewComponent from "./components/dateView";
import RemindComponent from "./components/reminders";
import Link from "next/link";
import { MdLibraryAdd } from "react-icons/md";
import {
  ImCrying2,
  ImSad2,
  ImConfused2,
  ImNeutral2,
  ImSmile2,
  ImHappy2,
} from "react-icons/im";
import { GiDualityMask } from "react-icons/gi";
import MyModal from "./components/modal";
import { AiOutlineClose } from "react-icons/ai";

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

  const thisDay = moment(value).format("DD/MM/YY");
  const hour = moment().format("HH:mm");

  const currentDayTasks = myTasks.filter((task) => task.date === thisDay);
  const currentDayComments = myComments.filter((com) => com.date === thisDay);

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");

  //Checa se é o dia de hoje ou dias anteriores
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
      return "Amanhã, " + thisDay;
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
    //Pega as anotações do usuário
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
    //Pega as anotações do usuário
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
      {show && <MyModal children={element} setShow={setShow} />}
      <div className="bg-[#4361ee] h-screen">
        <DateViewComponent dateProps={{ user, value, onChange, reminders }} />
        <header className="p-2 text-gray-100">
          <h1 className="text-lg font-semibold">{dayView()}</h1>
        </header>
        {user && (
          <div className="w-5/6 m-auto">
            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                {greetingMsg()}, {user.name}
              </h2>
            </div>
            <div className="flex justify-center">
              <div className="border border-stone-800 rounded-full">
                <img src={user.avatar} className="rounded-full"></img>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-1/2">
                {presentOrPast && (
                  <CommentComponent
                    user={user}
                    myComments={currentDayComments}
                    currentComments={currentComments}
                    value={value}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-around gap-10 text-stone-800">
              <div
                onClick={() => setCard(1)}
                className={`p-3 bg-radio duration-200 hover:bg-amaranth hover:border-white hover:text-gray-100 text-stone-800 cursor-pointer border border-radio rounded-md relative ${
                  card === 1 && "flex-1"
                }`}
              >
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xl font-bold">COMENTÁRIOS</p>
                  <div className="p-5">
                    <HumorIcon mood={humorAvg()} />
                  </div>
                </div>

                {card === 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCard(0);
                      }}
                      className="absolute top-0 right-1"
                    >
                      <AiOutlineClose />
                    </button>
                    {currentDayComments.map((item, index) => (
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
                  </>
                )}
              </div>
              <div
                className={`p-3 bg-radio duration-200 hover:bg-amaranth hover:border-white hover:text-gray-100 text-stone-800 cursor-pointer border border-radio rounded-md flex flex-col justify-center items-center ${
                  card === 2 && "flex-1"
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
                  }}
                />
              </div>
              <div className="p-3 bg-radio duration-200 hover:bg-amaranth hover:border-white hover:text-gray-100 text-stone-800 cursor-pointer border border-radio rounded-md flex flex-col justify-center items-center">
                <p className="text-xl font-bold ">ANOTAÇÕES</p>
                <p className="text-3xl p-2">{myNotes.length}</p>
                <button>
                  <MdLibraryAdd />
                </button>
              </div>
              <div className="p-3 bg-radio duration-200 hover:bg-amaranth hover:border-white hover:text-gray-100 text-stone-800 cursor-pointer border border-radio rounded-md flex flex-col justify-center items-center">
                <p className="text-xl font-bold ">LEMBRETES</p>
                <p className="text-3xl p-2">{myReminders.length}</p>
                <button>
                  <MdLibraryAdd />
                </button>
              </div>
            </div>
            {/* <MyNotesComponent
              user={user}
              myNotes={myNotes}
              currentNotes={currentNotes}
            />
            <RemindComponent
              user={user}
              myReminders={myReminders}
              currentReminders={currentReminders}
            /> */}
            <div>
              <DayEvaluation
                user={user}
                dayVal={dayVal}
                setDayVal={setDayVal}
                value={value}
              />
            </div>
            <Link
              href={{ pathname: "/user_stats", query: { email: user.email } }}
            >
              <a>Estatísticas</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Today;

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
