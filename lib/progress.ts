import dayjs from 'dayjs';
import { DailyLog, Status } from './types';

export type ProgressMetrics = {
  donePages: number;
  daysLeft: number;
  remainingPages: number;
  elapsedDays: number;
  currentPpd: number;
  requiredPpd: number;
  hasLogToday: boolean;
  status: Status;
};

export function computeMetrics(params: {
  logs: DailyLog[];
  totalPages: number;
  deadline: string;
  startDate: string;
  today?: string;
}) {
  const today = dayjs(params.today ?? dayjs().format('YYYY-MM-DD'));
  const donePages = params.logs.reduce((sum, log) => sum + log.pages_done, 0);
  const daysLeft = Math.max(dayjs(params.deadline).diff(today, 'day'), 0);
  const remainingPages = Math.max(params.totalPages - donePages, 0);
  const elapsedDays = Math.max(today.diff(dayjs(params.startDate), 'day') + 1, 1);
  const requiredPpd = remainingPages / Math.max(daysLeft, 1);
  const currentPpd = donePages / elapsedDays;
  const todayStr = today.format('YYYY-MM-DD');
  const hasLogToday = params.logs.some((log) => log.log_date === todayStr);

  let status: Status = 'ON_TRACK';
  if (remainingPages === 0) {
    status = 'DONE';
  } else if (daysLeft === 0) {
    status = 'FINAL_DAY';
  } else if (!hasLogToday) {
    status = 'NO_LOG_TODAY';
  } else if (currentPpd < requiredPpd * 0.7 || (daysLeft <= 2 && remainingPages > 0)) {
    status = 'DANGER';
  } else if (currentPpd < requiredPpd * 0.9) {
    status = 'BEHIND';
  } else if (currentPpd >= requiredPpd * 1.15) {
    status = 'AHEAD';
  }

  return {
    donePages,
    daysLeft,
    remainingPages,
    elapsedDays,
    currentPpd,
    requiredPpd,
    hasLogToday,
    status,
  } satisfies ProgressMetrics;
}
