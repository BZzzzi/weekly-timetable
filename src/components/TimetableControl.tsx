"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Timetable from "./Timetable";

const getSemester = (date: dayjs.Dayjs): string => {
  const month = date.month() + 1;
  const day = date.date();

  if (month === 3 || month === 4 || month === 5 || (month === 6 && day <= 30)) {
    return "1학기";
  } else if ((month === 7 && day >= 1) || month === 8) {
    return "하계방학";
  } else if (month === 9 || month === 10 || month === 11 || (month === 12 && day <= 31)) {
    return "2학기";
  } else if (month === 1 || month === 2 || (month === 12 && day >= 1)) {
    return "동계방학";
  }
  return "";
};

const getWeekInfo = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week").add(1, "day");
  const endOfWeek = startOfWeek.add(4, "days");
  const semester = getSemester(date);

  return {
    year: date.year(),
    semester,
    weekStart: startOfWeek.format("MM.DD"),
    weekEnd: endOfWeek.format("MM.DD"),
  };
};

const TimetableControl = ({ isAdmin }: { isAdmin: boolean }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekInfo, setWeekInfo] = useState(getWeekInfo(currentDate));

  // TODO: 주 변경에 따라 시간표 데이터 불러오기
  useEffect(() => {
    console.log("currentDate", currentDate.format("YYYY-MM-DD"));
  }, [currentDate]);

  const handlePrevWeek = () => {
    const prevWeekDate = currentDate.subtract(1, "week");
    setCurrentDate(prevWeekDate);
    setWeekInfo(getWeekInfo(prevWeekDate));
  };

  const handleNextWeek = () => {
    const nextWeekDate = currentDate.add(1, "week");
    setCurrentDate(nextWeekDate);
    setWeekInfo(getWeekInfo(nextWeekDate));
  };

  const temp = [
    { day: "월", time: "09:30 - 10:00", content: "김현진\n[면담 완료]" },
    { day: "화", time: "10:00 - 10:30", content: "감준영\n[진행 중]" },
    { day: "목", time: "11:00 - 11:30", content: "이유진\n[확인 중]" },
  ];

  return (
    <div className="text-sm lg:text-base p-4">
      {/* TODO: 안내 문구 */}
      <div className="flex justify-between items-center mb-4">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={handlePrevWeek}>
          ◀
        </button>
        <h1 className="text-xl font-bold text-center">
          {weekInfo.year}년 {weekInfo.semester}
          <br />
          {weekInfo.weekStart}(월) ~ {weekInfo.weekEnd}(금)
        </h1>
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleNextWeek}>
          ▶
        </button>
      </div>
      <Timetable isAdmin={isAdmin} schedule={temp} />
    </div>
  );
};

export default TimetableControl;
