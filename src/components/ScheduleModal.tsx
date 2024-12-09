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
    // TODO: 필수값 처리
    if (!initData) return;

    const isNew = !initData.id; // ID가 없으면 POST로 새로 생성
    const method = isNew ? "POST" : "PUT"; // 전체 데이터 전송은 PUT 사용
    const { day, time, ...body } = initData!;
    // const { day, time, id, ...body } = initData!;

    await fetch("/api/schedule", {
      method,
      body: JSON.stringify(body),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[85%] lg:w-1/2 p-6">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center text-xl font-bold">
            면담 신청
            <span className="flex items-center text-sm font-normal mt-1 ml-3">
              {initData?.day}요일 {initData?.time}
            </span>
          </h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-black text-lg font-bold">
            ✕
          </button>
        </div>

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

export default ScheduleModal;
