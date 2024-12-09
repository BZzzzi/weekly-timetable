export interface InterviewListRequest {
  startDate: string;
  endDate: string;
}

export interface Interview {
  id: string;
  name: string;
  student_signature: number;
  email: string;
  subject: string;
  meeting_detail: string;
  duration_10minutes_over: boolean;
  date: string;
  start_time: string;
  end_time: string;
  state: string;
  delay_reason?: string | null;
}
export interface CellInfo extends Interview {
  day: string;
  time: string;
}
export type InterviewResponse = Interview[];
export type CreateInterviewRequest = Omit<Interview, "id" | "delay_reason">;

export interface Schedule {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}
export type ScheduleResponse = Schedule[];
export type CreateScheduleRequest = Omit<Schedule, "id">;
