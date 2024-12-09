import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

/**
 * 날짜를 넘기면 한국 기준 요일을 반환하는 함수
 * @param date 'YYYY-MM-DD' ex. '2024-12-09'
 * @returns '월'
 */
export const shortDayOfWeek = (date: string) => {
  return dayjs(date).locale("ko").format("ddd");
};
