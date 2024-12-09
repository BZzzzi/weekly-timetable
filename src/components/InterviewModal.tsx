"use client";

import { INTERVIEW_STATES, SUBJECTS } from "@/common/const";
import { CellInfo } from "@/common/types";
import { useState } from "react";

interface Props {
  initData: CellInfo | null;
  closeModal: () => void;
  isAdmin: boolean;
}

/**
 * 학생용 입력 모달
 */
const InterviewModal = ({ initData, closeModal, isAdmin }: Props) => {
  const [formData, setFormData] = useState(initData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => {
      if (!prev) return null;

      // 타입에 따라 값 변환
      const updatedValue =
        type === "checkbox" ? checked : name === "student_signature" ? parseInt(value, 10) : value;

      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  const saveData = async () => {
    // TODO: 필수값 처리
    if (!formData) return;

    // TODO: POST/PUT 로직 정리 필요
    const isNew = !formData.id; // ID가 없으면 POST로 새로 생성
    const method = isNew ? "POST" : "PUT"; // 전체 데이터 전송은 PUT 사용

    const { day, time, ...postBody } = formData!;
    postBody.state = "교수 확인 중";

    const { id, ...putBody } = postBody!;

    const body = !isNew ? postBody : putBody;

    await fetch("/api/interview", {
      method,
      body: JSON.stringify(body),
    });

    closeModal();
    // TODO: 새로고침 필요
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[85%] lg:w-1/2 p-6">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center text-xl font-bold">
            면담 신청
            <span className="flex items-center text-sm font-normal mt-1 ml-3">
              {formData?.day}요일 {formData?.time}
            </span>
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-black text-lg font-bold">
            ✕
          </button>
        </div>

        {/* 모달 바디 */}
        <form className="space-y-4">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-1">
              이름<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData?.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름 입력"
            />
          </div>

          {/* 학번 */}
          <div>
            <label htmlFor="student_signature" className="block text-sm font-bold mb-1">
              학번<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="student_signature"
              name="student_signature"
              value={formData?.student_signature || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="학번 입력"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">
              이메일<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일 입력"
            />
          </div>

          {/* 수강과목 */}
          <div>
            <label htmlFor="subject" className="block text-sm font-bold mb-1">
              수강과목<span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full border-2 py-2 px-1 rounded-sm"
              value={formData?.subject || ""}
              onChange={handleChange}
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* 면담 희망내용 */}
          <div>
            <label htmlFor="meeting_detail" className="block text-sm font-bold mb-1">
              면담 희망내용<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              id="meeting_detail"
              name="meeting_detail"
              onChange={handleChange}
              value={formData?.meeting_detail || ""}
              placeholder="내용 입력"
            ></textarea>

            {/* 10분 이상 체크 */}
            <div className="flex items-center gap-2">
              <label htmlFor="duration_10minutes_over">
                면담은 10분 내외로 진행됩니다. 10분 이상 희망 시 체크 표시
              </label>
              <input
                type="checkbox"
                id="duration_10minutes_over"
                name="duration_10minutes_over"
                checked={formData?.duration_10minutes_over || false}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 면담상태 */}
          <div>
            <label htmlFor="state" className="block text-sm font-bold mb-1">
              면담상태<span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              className="w-full border-2 py-2 px-1 rounded-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
              value={formData?.state}
              onChange={handleChange}
              disabled={!isAdmin}
            >
              {INTERVIEW_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span>수정 저장 시, 자동으로 "교수 확인 중"으로 변경</span>
          </div>

          {isAdmin && (
            <div>
              <label htmlFor="delay_reason" className="block text-sm font-bold mb-1">
                면담 불가 사유<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="delay_reason"
                name="delay_reason"
                value={formData?.delay_reason ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일 입력"
              />
            </div>
          )}
        </form>

        {/* 모달 푸터 */}
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded mr-2">
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={saveData}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
