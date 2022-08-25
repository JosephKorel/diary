import React, { useEffect, useState } from "react";
import moment from "moment";
import { MyComments, MyNotes, MyTasks, User } from "../models/interfaces";
import { GetServerSideProps } from "next";
import MyTasksComp from "./components/tasks";
import MyNotesComponent from "./components/notes";

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
  const [text, setText] = useState("");
  const [moodValue, setMoodValue] = useState(0);

  const getUserData = async () => {
    const today = moment().format("DD/MM/YY");
    const currentUser: User = await JSON.parse(localStorage.getItem("user"));

    const todayNotes = notes.filter((note) => note.date === today);
    const todayTasks = tasks.filter((task) => task.date === today);
    const todayComments = comments.filter((com) => com.date === today);

    setUser(currentUser);
    setMyTasks(todayTasks);
    setMyNotes(todayNotes);
    setMyComments(todayComments);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const currentTasks = async (currentUser: User): Promise<void> => {
    const today = moment().format("DD/MM/YY");

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
    const today = moment().format("DD/MM/YY");
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
    const today = moment().format("DD/MM/YY");
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

  const addComment = async () => {
    const today = moment().format("DD/MM/YY");
    const time = moment().format("HH:mm");

    const newComment = {
      author: user.name,
      email: user.email,
      comment: text,
      mood: moodValue,
      time,
      date: today,
    };

    const insert = await fetch(`/api/comments/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    try {
      if (insert.ok) {
        currentComments(user);
        setText("");
        setMoodValue(0);
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
          </div>
          <div className="flex justify-around items-center">
            <MyTasksComp
              user={user}
              myTasks={myTasks}
              currentTasks={currentTasks}
            />
            <MyNotesComponent
              user={user}
              myNotes={myNotes}
              currentNotes={currentNotes}
            />
            <div className="p-20 bg-red-300 rounded-lg">
              <h2>Como você está neste momento?</h2>
              <input
                placeholder="Escreva aqui"
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
              />
              <p>Humor</p>
              <input
                placeholder="0 - Muito triste, 10 - Muito feliz"
                value={moodValue}
                onChange={(e) => setMoodValue(Number(e.currentTarget.value))}
              />
              <button onClick={addComment}>Confirmar</button>
              <p>Comentários: {myComments.length}</p>
              {myComments.map((item) => (
                <p>
                  {item.comment} as {item.time}
                </p>
              ))}
            </div>
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
