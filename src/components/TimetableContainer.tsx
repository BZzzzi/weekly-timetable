"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { CellInfo } from "@/common/types";
import { shortDayOfWeek } from "@/utils/utils";
import Timetable from "./Timetable";

// 파라미터로 보낸 달에 따라 학기 텍스트를 반환함
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

// 현재 날짜 기준으로 필요한 날짜 데이터들을 가공하여 리턴함
const getWeekInfo = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week").add(1, "day");
  const endOfWeek = startOfWeek.add(4, "days");
  const semester = getSemester(date);

  return {
    year: date.year(),
    semester,
    weekStart: startOfWeek.format("MM.DD"), // 시간표 상단 표시
    weekEnd: endOfWeek.format("MM.DD"),
    startDate: startOfWeek.format("YYYY-MM-DD"), // api 저장용
    endDate: endOfWeek.format("YYYY-MM-DD"),
  };
};

const TimetableControl = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [schedules, setSchedules] = useState<CellInfo[]>([]);

  const isProfessor = localStorage.getItem("isLoggedIn"); // 교수님 권한 여부

  // currentDate가 변경될 때(화살표로 지난주/다음주 클릭)마다 계산하여 할당
  const weekInfo = useMemo(() => getWeekInfo(currentDate), [currentDate]);

  // weekInfo.startDate가 변경될 때마다 날짜 배열 계산하여 할당
  const weekDates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) =>
        dayjs(weekInfo.startDate).add(index, "day").format("YYYY-MM-DD"),
      ),
    [weekInfo.startDate],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // 데이터 가공
        const newData = data.map((item) => ({
          ...item,
          time: `${item.start_time} - ${item.end_time}`,
          day: shortDayOfWeek(item.date),
        }));
        setSchedules(newData);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };
    fetchData();
  }, [weekInfo.startDate, weekInfo.endDate]);

  const handlePrevWeek = () => {
    setCurrentDate((prev) => prev.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => prev.add(1, "week"));
  };

  return (
    <div className="text-sm lg:text-base p-4">
      {/* TODO: 안내 문구 */}
      <div className="flex justify-between items-center">
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
      {isProfessor &&
        (window.location.pathname === "/admin" ? (
          <Link className="flex justify-end underline" href="/">
            메인 페이지로 이동하기
          </Link>
        ) : (
          <Link className="flex justify-end underline" href="/admin">
            어드민 페이지로 이동하기
          </Link>
        ))}

      <Timetable schedules={schedules} weekDates={weekDates} />
    </div>
  );
};

export default TimetableControl;
