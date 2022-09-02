import React, { useState } from "react";
import moment from "moment";
import Calendar, { Detail } from "react-calendar";
import { BsFillCalendarDateFill } from "react-icons/bs";
import "react-calendar/dist/Calendar.css";
import { MyReminder, TimeSpanInt, User } from "../../models/interfaces";

interface DateView {
  dateProps: {
    user: User;
    value: Date;
    onChange: (data: Date) => void;
    setTime?: (data: TimeSpanInt) => void;
    reminders: MyReminder[];
  };
}

export default function DateViewComponent({
  dateProps,
}: DateView): JSX.Element {
  const [show, setShow] = useState(false);

  const { user, value, onChange, setTime, reminders } = dateProps;

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
        <div>
          {user.dayEvaluation.map((item) => {
            if (item.date === moment(date).format("DD/MM/YY")) {
              return <p>Nota: {item.value}</p>;
            }
          })}
        </div>
        <div>
          {reminders.map((rmd) => {
            if (rmd.when === moment(date).format("DD/MM/YY")) {
              return <div className="rounded-full p-1 bg-green-500"></div>;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <button onClick={() => setShow(!show)}>
        <BsFillCalendarDateFill />
      </button>
      <div className={show ? "" : "hidden"}>
        <Calendar
          value={value}
          onChange={(value: Date) => {
            let date = moment(value).format("DD/MM/YY");
            const now = moment().startOf("day");
            const dayDiff = now.diff(moment(value).startOf("day"), "days");
            if (setTime) {
              onChange(value);
              setTime({
                when: "Dia",
                date,
                difference: dayDiff,
                onSpan: false,
              });
            } else onChange(value);
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
}

/* const dayView = (value: Date): string => {
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
}; */
