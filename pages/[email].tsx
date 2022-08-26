import React, { useEffect, useState } from "react";
import moment from "moment";
import { MyComments, MyNotes, MyTasks, User } from "../models/interfaces";
import { GetServerSideProps } from "next";
import MyTasksComp from "./components/tasks";
import MyNotesComponent from "./components/notes";
import CommentComponent from "./components/comments";

function Today({
  notes,
  tasks,
  comments,
}: {
  notes: MyNotes[];
  tasks: MyTasks[];
  comments: MyComments[];
}) {
  const [user, setUser] = useState<User | null>(null);
  const [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  const [myNotes, setMyNotes] = useState<MyNotes[]>([]);
  const [myComments, setMyComments] = useState<MyComments[]>([]);
  const [dayVal, setDayVal] = useState(0);

  const today = moment().format("DD/MM/YY");
  const currentTime = moment().format("HH:mm");

  const getUserData = async () => {
    const currentUser: User = await JSON.parse(localStorage.getItem("user"));

    const todayTasks = tasks.filter((task) => task.date === today);
    const todayComments = comments.filter((com) => com.date === today);

    setUser(currentUser);
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

  const evaluateDay = async () => {
    const handleEvaluation = await fetch(`/api/user/${user.email}`, {
      method: "PATCH",
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
            {currentTime <= "20:00" && (
              <>
                <p>Avalie o dia de hoje</p>
                <input
                  value={dayVal}
                  onChange={(e) => setDayVal(Number(e.currentTarget.value))}
                />
                <button onClick={evaluateDay}>Confirmar</button>
              </>
            )}
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
      notes: MyNotes[];
      tasks: MyTasks[];
      comments: MyComments[];
    };

    return {
      props: {
        notes: userData.notes,
        tasks: userData.tasks,
        comments: userData.comments,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
