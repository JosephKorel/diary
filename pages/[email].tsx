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
  const [dayVal, setDayVal] = useState<Evaluation[]>([]);
  const [value, onChange] = useState(new Date());

  const today = moment().format("DD/MM/YY");
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
      const todayTasks = tasks.tasks;
      const taskFilter = todayTasks.filter((item) => item.date === today);
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

  return (
    <div>
      <DateViewComponent dateProps={{ user, value, onChange, reminders }} />
      {user && (
        <div className="w-5/6 m-auto">
          {/* <header className="p-2">
            <h1 className="text-lg font-semibold">
              {greetingMsg()}, {user.name}
            </h1>
          </header> */}
          <div className="flex justify-center">
            <div className="border border-stone-800 rounded-full">
              <img src={user.avatar} className="rounded-full"></img>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {greetingMsg()}, {user.name}
            </h2>
          </div>
          <div className="flex flex-col absolute">
            <p className="text-lg p-3 bg-indigo-700 rounded-full">ANOTAÇÕES</p>
            <p className="text-lg p-3 bg-indigo-700 rounded-full">TAREFAS</p>
            <p className="text-lg p-3 bg-indigo-700 rounded-full">LEMBRETES</p>
          </div>
          <div className="flex justify-center">
            <div className="">
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
          <MyNotesComponent
            user={user}
            myNotes={myNotes}
            currentNotes={currentNotes}
          />
          <div className="flex justify-around items-center">
            <MyTasksComp
              user={user}
              myTasks={currentDayTasks}
              currentTasks={currentTasks}
              value={value}
            />
          </div>
          <RemindComponent
            user={user}
            myReminders={myReminders}
            currentReminders={currentReminders}
          />
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
