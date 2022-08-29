import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  DateInt,
  Evaluation,
  MyComments,
  MyNotes,
  MyTasks,
  User,
} from "../models/interfaces";
import { GetServerSideProps } from "next";
import MyTasksComp from "./components/tasks";
import MyNotesComponent from "./components/notes";
import CommentComponent from "./components/comments";
import DayEvaluation from "./components/dayEval";
import { IoMdArrowDropdown } from "react-icons/io";
import Calendar, { Detail } from "react-calendar";
import { BsFillCalendarDateFill } from "react-icons/bs";
import "react-calendar/dist/Calendar.css";

function Today({
  user,
  notes,
  tasks,
  comments,
}: {
  user: User;
  notes: MyNotes[];
  tasks: MyTasks[];
  comments: MyComments[];
}) {
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [myNotes, setMyNotes] = useState<MyNotes[]>([]);
  const [myComments, setMyComments] = useState<MyComments[]>([]);
  const [dayVal, setDayVal] = useState<Evaluation[]>([]);
  const [value, onChange] = useState(new Date());

  const today = moment().format("DD/MM/YY");

  const [currentDate, setCurrentDate] = useState<DateInt>({
    when: "Hoje",
    date: today,
  });

  const getUserData = (date: string) => {
    const todayTasks = tasks.filter((task) => task.date === date);
    const todayComments = comments.filter((com) => com.date === date);
    const todayVal = user.dayEvaluation.filter((item) => item.date === date);

    setDayVal(todayVal);
    setMyTasks(todayTasks);
    setMyNotes(notes);
    setMyComments(todayComments);
  };

  useEffect(() => {
    getUserData(today);
  }, []);

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
      setMyTasks(taskFilter);
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
      const todayComments = comments.comments.filter(
        (com) => com.date === today
      );
      setMyComments(todayComments);
    } catch (error) {
      console.log(error);
    }
  };

  const DateDisplay = (): JSX.Element => {
    const [show, setShow] = useState(false);

    const days = [
      { when: "Hoje", daysAgo: 0 },
      { when: "Ontem", daysAgo: 1 },
      { when: "3 dias atrás", daysAgo: 3 },
    ];

    const dayView = (value: Date): string => {
      const now = moment().startOf("day");
      const viewDay = moment(value).format("DD/MM/YY");
      const dayDiff = now.diff(moment(value).startOf("day"), "days");

      if (dayDiff === 0) {
        return "Hoje" + viewDay;
      } else if (dayDiff === 1) {
        return "Ontem" + viewDay;
      } else if (dayDiff === -1) {
        return "Amanhã" + viewDay;
      } else return viewDay;
    };

    const TileDiv = ({
      activeStartDate,
      date,
      view,
    }: {
      activeStartDate: Date;
      date: Date;
      view: Detail;
    }) => {
      return (
        <div>
          {user.dayEvaluation.map((item) => {
            if (item.date === moment(date).format("DD/MM/YY")) {
              return <p>Nota: {item.value}</p>;
            }
          })}
        </div>
      );
    };

    return (
      <div className="flex">
        <div className="flex flex-col">
          <p>{dayView(value)}</p>
        </div>
        <button onClick={() => setShow(!show)}>
          <BsFillCalendarDateFill />
        </button>
        <div className={show ? "" : "hidden"}>
          <Calendar
            value={value}
            onChange={(value: Date) => {
              getUserData(moment(value).format("DD/MM/YY"));
              onChange(value);
            }}
            tileContent={({ activeStartDate, date, view }) => (
              <TileDiv
                activeStartDate={activeStartDate}
                date={date}
                view={view}
              />
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <DateDisplay />
      {user && (
        <div>
          <div>
            <img src={user.avatar}></img>
            <h2>Olá, {user.name}</h2>
            <MyNotesComponent
              user={user}
              myNotes={myNotes}
              currentNotes={currentNotes}
            />
          </div>
          <div className="flex justify-around items-center">
            <MyTasksComp
              user={user}
              myTasks={myTasks}
              currentTasks={currentTasks}
            />
            <CommentComponent
              user={user}
              myComments={myComments}
              currentComments={currentComments}
            />
          </div>
          <div>
            <DayEvaluation
              user={user}
              dayVal={dayVal}
              setDayVal={setDayVal}
              currentDate={currentDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Today;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const email = context.query.email;

  const fetchData = await fetch(`http://localhost:3000/api/user/${email}`);

  const fetchResult = await fetchData.json();

  try {
    const userData = fetchResult as {
      currUser: User;
      notes: MyNotes[];
      tasks: MyTasks[];
      comments: MyComments[];
    };

    return {
      props: {
        user: userData.currUser,
        notes: userData.notes,
        tasks: userData.tasks,
        comments: userData.comments,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
