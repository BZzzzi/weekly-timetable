"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Timetable from "./Timetable";
import { CellInfo } from "@/common/types";
import { shortDayOfWeek } from "@/utils/utils";

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
    startDate: startOfWeek.format("YYYY-MM-DD"),
    endDate: endOfWeek.format("YYYY-MM-DD"),
  };
};

const TimetableControl = ({ isAdmin }: { isAdmin: boolean }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekInfo, setWeekInfo] = useState(getWeekInfo(currentDate));
  const [schedules, setSchedules] = useState<CellInfo[] | []>([]);

  // 요일과 날짜를 매핑
  const weekDates = Array.from({ length: 5 }, (_, index) =>
    dayjs(weekInfo.startDate).add(index, "day").format("YYYY-MM-DD"),
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/interview?${new URLSearchParams({
          startDate: weekInfo.startDate,
          endDate: weekInfo.endDate,
        })}`,
        {
          method: "GET",
        },
      );
      const data: CellInfo[] = await response.json();

      // 화면 렌더링용으로 데이터 가공:
      const newData = data.map((item) => ({
        ...item,
        time: `${item.start_time} - ${item.end_time}`,
        day: shortDayOfWeek(item.date),
      }));
      setSchedules(newData);
    };
    fetchData();
  }, [weekInfo]);

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
      <Timetable isAdmin={isAdmin} schedules={schedules} weekDates={weekDates} />
    </div>
  );
};

export default TimetableControl;
