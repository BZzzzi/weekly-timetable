"use client";

import React, { useEffect, useState } from "react";
import { DAYS, TIMES } from "@/common/const";
import { CellInfo } from "@/common/types";
import InterviewModal from "./InterviewModal";
import ScheduleModal from "./ScheduleModal";

interface Props {
  schedules: CellInfo[] | [];
  isAdminPage: boolean;
  weekDates: string[];
}

const Timetable: React.FC<Props> = ({ schedules, isAdminPage, weekDates }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CellInfo | null>({
    id: "",
    day: "",
    time: "",
    name: "",
    student_signature: 0,
    email: "",
    subject: "",
    meeting_detail: "",
    duration_10minutes_over: false,
    date: "",
    start_time: "",
    end_time: "",
    state: "",
    delay_reason: "",
  });

  const openModal = ({ id, day, time }: { id: string; day: string; time: string }) => {
    // 등록된 스케줄이 있는 칸인지 아닌지 체크
    const schedule = schedules.find((item) => item.id === id) || null;
    if (schedule) {
      setFormData({
        ...schedule,
        day,
        time,
      });
    } else {
      // 빈 칸이면, 필요한 값 세팅
      const date = weekDates[DAYS.indexOf(day)];
      setFormData({
        ...schedule!,
        day,
        time,
        date,
        start_time: time.split(" - ")[0],
        end_time: time.split(" - ")[1],
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData(null);
  };

  /**
   * state를 넘기면 배경색을 리턴
   * 색상 출처: tailwindcss 공식문서(https://tailwindcss.com/docs/background-color)
   */
  const stateColors: Record<string, string> = {
    "교수 확인 중": "bg-amber-100",
    확정: "bg-sky-200",
    "재신청 필요": "bg-fuchsia-400",
    "면담 완료": "bg-emerald-200",
    "면담 불참": "bg-red-200",
    "면담 불가": "bg-neutral-300",
  };
  const applyCellColor = (state: string) => stateColors[state] || "bg-white";

  return (
    <>
      <div className="grid grid-cols-6 border border-gray-300">
        {/* 요일 헤더 */}
        <div className="bg-gray-100 p-2 font-bold text-center border border-gray-300">교시</div>
        {DAYS.map((day, index) => (
          <div key={index} className="bg-gray-100 p-2 font-bold text-center border border-gray-300">
            {day}
          </div>
        ))}

        {/* 시간표 내용 */}
        {TIMES.map((time, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* 시간 표시 */}
            <div className="bg-gray-100 p-2 text-center border border-gray-300">{time}</div>
            {/* 칸 */}
            {DAYS.map((day, colIndex) => {
              const cellData = schedules.find((item) => item.day === day && item.time === time);
              const cellState = cellData ? (cellData.name ? cellData.state : "면담 불가") : "";

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${applyCellColor(
                    cellState,
                  )} p-2 border border-gray-300 cursor-pointer hover:opacity-70`}
                  onClick={() => openModal({ id: cellData?.id || "", day, time })}
                >
                  {cellData ? (
                    cellData.name ? (
                      <div>
                        <div>{cellData.name}</div>
                        <div>{cellData.state}</div>
                      </div>
                    ) : (
                      <div>
                        교수일정
                        <br />
                        면담불가
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {isModalOpen &&
        (isAdminPage ? (
          formData?.name ? (
            <InterviewModal initData={formData} closeModal={closeModal} isAdminPage={isAdminPage} />
          ) : (
            <ScheduleModal initData={formData} closeModal={closeModal} />
          )
        ) : formData?.name ? (
          <InterviewModal initData={formData} closeModal={closeModal} isAdminPage={isAdminPage} />
        ) : null)}
    </>
  );
};

export default Timetable;
