"use client";

import React, { useState } from "react";
import { DAYS, TIMES } from "@/common/const";
import { CellInfo } from "@/common/types";

interface Props {
  schedule: CellInfo[] | [];
  isAdmin: boolean;
}

const Timetable: React.FC<Props> = ({ schedule, isAdmin }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<CellInfo | null>(null);

  const openModal = (day: string, time: string, content?: string) => {
    setSelectedCell({ day, time, content });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCell(null);
  };

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
            {/* 빈 칸 */}
            {DAYS.map((day, colIndex) => {
              const cellData = schedule.find((item) => item.day === day && item.time === time);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`p-2 border border-gray-300 cursor-pointer ${
                    cellData ? "bg-blue-100 hover:bg-blue-200" : "hover:bg-gray-200"
                  }`}
                  onClick={() => openModal(day, time, cellData?.content)}
                >
                  {cellData?.content?.split("\n").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* 모달 */}
      {isModalOpen && selectedCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[85%] lg:w-1/2 p-6">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                면담 신청
                <span className="block text-sm font-normal mt-1">
                  {selectedCell.day} - {selectedCell.time}
                </span>
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* 모달 바디 */}
            <form className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  이름<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={selectedCell.content?.split("\n")[0] || ""}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이름 입력"
                />
              </div>

              {/* 면담 내용 */}
              <div>
                <label className="block text-sm font-bold mb-1">면담 내용</label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  defaultValue={selectedCell.content?.split("\n")[1] || ""}
                  placeholder="내용 입력"
                ></textarea>
              </div>
            </form>

            {/* 모달 푸터 */}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timetable;
