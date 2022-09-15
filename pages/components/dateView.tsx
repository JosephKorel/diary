import React, { useState } from "react";
import moment from "moment";
import Calendar, { Detail } from "react-calendar";
import {
  BsFillCalendarDateFill,
  BsFillCalendarEventFill,
} from "react-icons/bs";
import "react-calendar/dist/Calendar.css";
import { MyReminder, TimeSpanInt, User } from "../../models/interfaces";
import { GiCancel } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { VscDebugBreakpointData } from "react-icons/vsc";

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
      <div className="flex flex-col justify-center items-center">
        <div className="">
          {user.dayEvaluation.map((item) => {
            if (item.date === moment(date).format("DD/MM/YY")) {
              return (
                <div className="flex items-center gap-1 text-xs">
                  <VscDebugBreakpointData />
                  <p>{item.value}</p>
                </div>
              );
            } else return <div className=""></div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <button
        onClick={() => setShow(!show)}
        className="p-1 text-shark duration-200 rounded-md hover:bg-shark hover:text-gray-100"
      >
        <BsFillCalendarDateFill />
      </button>
      <div
        className={
          show
            ? "absolute z-10 fade rounded-md p-2 bg-gray-100 flex gap-1"
            : "hidden"
        }
      >
        <Calendar
          value={value}
          className="bg-gray-100 border-gray-100"
          navigationAriaLabel="Go up"
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
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShow(!show)}
            className="rounded-md duration-200 p-1 text-stone-800 hover:bg-shark hover:text-gray-100 self-end"
          >
            <AiOutlineClose />
          </button>
          <div className="flex items-center gap-1 text-xs w-full">
            <VscDebugBreakpointData className="text-shark" />
            <p>Avaliação do dia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
