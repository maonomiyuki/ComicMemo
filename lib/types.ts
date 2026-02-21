export type ConciergeStyle = 'butler' | 'genki' | 'senpai';
export type Reaction = 'PROGRESS' | 'COUNTDOWN' | 'PACE' | 'MEMO' | 'PRAISE';
export type Status =
  | 'NO_LOG_TODAY'
  | 'AHEAD'
  | 'ON_TRACK'
  | 'BEHIND'
  | 'DANGER'
  | 'FINAL_DAY'
  | 'DONE';

export type Profile = {
  id: string;
  display_name: string | null;
  concierge_style: ConciergeStyle;
  concierge_avatar_key: string;
  timezone: string;
  notification_time: string | null;
};

export type Project = {
  id: string;
  title: string;
  total_pages: number;
  deadline: string;
  start_date: string;
};

export type DailyLog = {
  id: string;
  log_date: string;
  pages_done: number;
  memo: string | null;
};

export type Task = {
  id: string;
  name: string;
  sort_order: number;
  is_enabled: boolean;
  has_page_progress: boolean;
};

export type TaskProgress = {
  task_id: string;
  done_pages: number;
  total_pages: number | null;
  is_checked: boolean;
};
