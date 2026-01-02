// 무료 버전 제한
export const FREE_LIMITS = {
  maxTags: 3,                    // 태그 최대 3개
  maxMonthlyDates: 1,            // 매월 날짜 선택 1개만
  maxRepeatingTasks: 1,          // 반복 일정 1개만
};

// 프리미엄 버전
export const PREMIUM_LIMITS = {
  maxTags: Infinity,
  maxMonthlyDates: Infinity,
  maxRepeatingTasks: Infinity,
};

// 반복 타입
export const REPEAT_TYPES = {
  NONE: 'none',                  // 반복 없음
  NEXT_WEEK_ONCE: 'nextWeekOnce', // 다음주 1번
  WEEKLY: 'weekly',              // 매주 (요일 복수선택)
  MONTHLY: 'monthly',            // 매월 (날짜 복수선택)
  YEARLY: 'yearly',              // 매년
};

export const REPEAT_LABELS = {
  [REPEAT_TYPES.NONE]: '반복 없음',
  [REPEAT_TYPES.NEXT_WEEK_ONCE]: '다음주 1번',
  [REPEAT_TYPES.WEEKLY]: '매주',
  [REPEAT_TYPES.MONTHLY]: '매월',
  [REPEAT_TYPES.YEARLY]: '매년',
};

// 요일
export const WEEKDAYS = [
  { key: 0, label: '일', short: '일' },
  { key: 1, label: '월', short: '월' },
  { key: 2, label: '화', short: '화' },
  { key: 3, label: '수', short: '수' },
  { key: 4, label: '목', short: '목' },
  { key: 5, label: '금', short: '금' },
  { key: 6, label: '토', short: '토' },
];

// 알림 타입
export const REMINDER_TYPES = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  SPECIFIC_DATE: 'specificDate',
};

export const REMINDER_LABELS = {
  [REMINDER_TYPES.MINUTES]: '분 전',
  [REMINDER_TYPES.HOURS]: '시간 전',
  [REMINDER_TYPES.DAYS]: '일 전',
  [REMINDER_TYPES.SPECIFIC_DATE]: '특정 날짜',
};

// 기본 알림 옵션
export const DEFAULT_REMINDER_OPTIONS = [
  { type: REMINDER_TYPES.MINUTES, value: 5, label: '5분 전' },
  { type: REMINDER_TYPES.MINUTES, value: 10, label: '10분 전' },
  { type: REMINDER_TYPES.MINUTES, value: 30, label: '30분 전' },
  { type: REMINDER_TYPES.HOURS, value: 1, label: '1시간 전' },
  { type: REMINDER_TYPES.HOURS, value: 2, label: '2시간 전' },
  { type: REMINDER_TYPES.DAYS, value: 1, label: '1일 전' },
  { type: REMINDER_TYPES.DAYS, value: 3, label: '3일 전' },
  { type: REMINDER_TYPES.DAYS, value: 7, label: '1주일 전' },
];
