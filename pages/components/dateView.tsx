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
      <div className="flex flex-col justify-start rounded-md bg-shark text-gray-100">
        <div className="">
          {user.dayEvaluation.map((item) => {
            if (item.date === moment(date).format("DD/MM/YY")) {
              return (
                <div className="flex items-center gap-1 text-xs">
                  <VscDebugBreakpointData />
                  <p>{item.value}</p>
                </div>
              );
            }
          })}
        </div>
        <div className="">
          {reminders.map((rmd) => {
            if (rmd.when === moment(date).format("DD/MM/YY")) {
              return (
                <div className="p-1">
                  <BsFillCalendarEventFill size={10} />
                </div>
              );
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
      <div
        className={
          show
            ? "absolute z-10 rounded-md p-2 bg-gray-100 flex gap-1"
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
        <div className="flex flex-col justify-center items-center self-start">
          <button
            onClick={() => setShow(!show)}
            className="rounded-md duration-200 hover:bg-gray-300"
          >
            <AiOutlineClose />
          </button>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1 text-xs w-full">
              <VscDebugBreakpointData className="text-shark" />
              <p>Avaliação do dia</p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <BsFillCalendarEventFill className="text-shark" />
              <p>Lembrete para este dia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
