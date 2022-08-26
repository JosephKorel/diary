import React, { useEffect, useState } from "react";
import moment from "moment";
import { MyComments, MyNotes, MyTasks, User } from "../models/interfaces";
import { GetServerSideProps } from "next";
import MyTasksComp from "./components/tasks";
import MyNotesComponent from "./components/notes";
import CommentComponent from "./components/comments";
import DayEvaluation from "./components/dayEval";

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

  const today = moment().format("DD/MM/YY");

  const getUserData = () => {
    const todayTasks = tasks.filter((task) => task.date === today);
    const todayComments = comments.filter((com) => com.date === today);

    setMyTasks(todayTasks);
    setMyNotes(notes);
    setMyComments(todayComments);
  };

  useEffect(() => {
    getUserData();
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
      const todayNotes = notes.notes.filter((note) => note.date === today);
      setMyNotes(todayNotes);
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

  return (
    <div>
      <h1>Dia {moment().format("DD/MM")}</h1>
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
            <DayEvaluation user={user} />
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
