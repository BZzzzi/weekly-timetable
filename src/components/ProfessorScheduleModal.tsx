"use client";

import { CellInfo } from "@/common/types";

interface Props {
  initData: CellInfo | null;
  closeModal: () => void;
}

/**
 * 교수용 입력 모달
 */
const ScheduleModal = ({ initData, closeModal }: Props) => {
  const saveData = async () => {
    if (!initData) return;

    try {
      const isNew = !initData.id; // id가 없으면 새 등록 = POST
      const method = isNew ? "POST" : "PUT";

      const { id, date, start_time, end_time } = initData;
      const body = {
        id,
        date,
        start_time,
        end_time,
      };

      const response = await fetch("/api/professor-schedule", {
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
      alert("저장되었습니다.");
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("Save error:", error);
      alert("저장 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      window.location.reload();
    }
  };

  const deleteData = async () => {
    if (!initData) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch("/api/professor-schedule", {
        method: "DELETE",
        body: JSON.stringify({ id: initData.id }),
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
            일정 등록
            <span className="flex items-center text-sm font-normal mt-1 ml-3">
              {initData?.day}요일 {initData?.time}
            </span>
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-black text-lg font-bold">
            ✕
          </button>
        </div>

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

export default ScheduleModal;
