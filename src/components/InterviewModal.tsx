"use client";

import { INTERVIEW_STATES, SUBJECTS } from "@/common/const";
import { CellInfo } from "@/common/types";
import { useState } from "react";

interface Props {
  initData: CellInfo | null;
  closeModal: () => void;
}

/**
 * 학생용 입력 모달
 */
const InterviewModal = ({ initData, closeModal }: Props) => {
  const isProfessor = localStorage.getItem("isLoggedIn");

  const [formData, setFormData] = useState(initData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => {
      if (!prev) return null;

      // 인풋 타입에 따라 저장할 값 변환
      const updatedValue =
        type === "checkbox" ? checked : name === "student_signature" ? parseInt(value, 10) : value;

      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  const saveData = async () => {
    if (!formData) return;

    // "재신청 필요"를 선택했으나 사유를 작성하지 않은 경우
    if (formData.state === "재신청 필요" && !formData.delay_reason) {
      alert("면담 불가 사유를 입력해주세요");
      return;
    }

    // 필수값 확인
    const requiredFields = ["name", "student_signature", "email", "subject", "meeting_detail"];
    const missingFields = requiredFields.filter((field) => !formData[field as keyof CellInfo]);
    if (missingFields.length > 0) {
      alert("필수 입력값을 모두 입력해주세요");
      return;
    }

    try {
      const isNew = !formData.id; // id가 없으면 새 면담 등록 = POST
      const method = isNew ? "POST" : "PUT";

      // 이 주석이 없으면 eslint 경고가 떠서 임시로 추가함
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, day, time, ...bodyData } = formData;

      // 교수가 입력하는 경우는 입력한 그대로, 학생이 등록/수정한 경우는 "교수 확인 중"으로
      const body = isProfessor
        ? bodyData
        : {
            ...bodyData,
            state: "교수 확인 중",
          };

      const response = await fetch("/api/interview", {
        method,
        body: JSON.stringify(isNew ? body : { ...body, id }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error:", error);
        alert(`저장 중 문제가 발생했습니다: ${error.message || "알 수 없는 에러"}`);
        return;
      }

      // 성공 처리
      alert(
        isNew
          ? "새 면담이 성공적으로 저장되었습니다."
          : "면담 정보가 성공적으로 업데이트되었습니다.",
      );
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
      alert("저장 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      window.location.reload();
    }
  };

  const deleteData = async () => {
    if (!formData) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch("/api/interview", {
        method: "DELETE",
        body: JSON.stringify({ id: formData.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error:", error);
        alert(`삭제 중 문제가 발생했습니다: ${error.message || "알 수 없는 에러"}`);
        return;
      }

      // 성공 처리
      alert("삭제되었습니다");
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
      alert("삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[85%] lg:w-1/2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center text-xl font-bold">
            김병정 교수님 면담 <br />
            공학관 3층(1311호)
            <span className="flex items-center text-sm font-normal mt-1 ml-3">
              {formData?.day}요일 {formData?.time}
            </span>
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-black text-lg font-bold">
            ✕
          </button>
        </div>

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
              disabled={!isProfessor}
            >
              {INTERVIEW_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span>{'수정 저장 시, 자동으로 "교수 확인 중" 상태로 변경됩니다.'}</span>
          </div>

          {/* 교수 권한이면서 "재신청 필요" 상태를 선택했을 때 OR 학생 권한이면서 교수가 입력한 면담 사유가 있을 경우 */}
          {/* 학생 권한일 땐 입력 불가(disabled) */}
          {((isProfessor && formData?.state === "재신청 필요") || initData?.delay_reason) && (
            <div>
              <label htmlFor="delay_reason" className="block text-sm font-bold mb-1">
                면담 불가 사유<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="delay_reason"
                name="delay_reason"
                disabled={!isProfessor}
                value={formData?.delay_reason ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="사유 입력"
              />
            </div>
          )}
        </form>

        <div className="flex justify-between mt-4">
          {initData?.id ? (
            <button onClick={deleteData} className="px-4 py-2 bg-red-500 text-white rounded mr-2">
              삭제
            </button>
          ) : (
            <div></div>
          )}
          <div>
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
    </div>
  );
};

export default InterviewModal;
