import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  DateInt,
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
    setMyReminders(reminders);
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
      <DateViewComponent dateProps={{ user, value, getUserData, onChange }} />
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
