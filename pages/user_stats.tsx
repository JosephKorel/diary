import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  MyComments,
  MyNotes,
  MyReminder,
  MyTasks,
  User,
} from "../models/interfaces";
import React, { useState } from "react";
import moment from "moment";

interface TimeSpanInt {
  when: string;
  date: string;
  difference: number;
}

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
  });

  const currentDay = moment(value).format("DD/MM/YY");

  const now = moment().startOf("day");
  const dayDiff = now.diff(moment(value).startOf("day"), "days");
  const router = useRouter();

  const TimeSpan = (): JSX.Element => {
    return (
      <div>
        <ul>
          <li onClick={() => handleSubtract(0)}>Hoje</li>
          <li onClick={() => handleSubtract(1)}>Ontem</li>
          <li onClick={() => handleSubtract(3)}>3 dias atrás</li>
          <li onClick={() => handleSubtract(7)}>1 semana atrás</li>
        </ul>
      </div>
    );
  };

  const handleSubtract = (time: number): void => {
    const timeSpan = now.subtract(time, "days");
    const selectedDay = timeSpan.format("DD/MM/YY");

    switch (time) {
      case 0:
        setTime({
          when: "Hoje",
          date: today,
          difference: time,
        });
        break;

      case 1:
        setTime({
          when: "Ontem",
          date: selectedDay,
          difference: time,
        });
        break;

      case 3:
        setTime({
          when: "3 dias atrás",
          date: selectedDay,
          difference: time,
        });
        break;

      case 7:
        setTime({
          when: "1 semana atrás",
          date: selectedDay,
          difference: time,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <button onClick={() => router.back()}>Voltar</button>
      <div>
        <div>
          <img src={user.avatar}></img>
        </div>
      </div>
      <div>
        <TimeSpan />
        <p>
          {time.when} <span>({time.date})</span>
        </p>
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
