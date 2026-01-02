import { format, addDays, addWeeks, addMonths, addYears, startOfWeek, getDay, setDay, isSameDay, isToday, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷팅
export const formatDate = (date, formatStr = 'yyyy년 M월 d일') => {
  return format(new Date(date), formatStr, { locale: ko });
};

export const formatTime = (date) => {
  return format(new Date(date), 'a h:mm', { locale: ko });
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'M월 d일 (EEE) a h:mm', { locale: ko });
};

export const formatShortDate = (date) => {
  return format(new Date(date), 'M/d (EEE)', { locale: ko });
};

// 5분 단위로 시간 반올림
export const roundToNearestFiveMinutes = (date) => {
  const d = new Date(date);
  const minutes = d.getMinutes();
  const roundedMinutes = Math.round(minutes / 5) * 5;
  d.setMinutes(roundedMinutes);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

// 다음 주 특정 요일 가져오기
export const getNextWeekDay = (dayOfWeek) => {
  const today = new Date();
  const nextWeekStart = addWeeks(startOfWeek(today, { weekStartsOn: 0 }), 1);
  return setDay(nextWeekStart, dayOfWeek);
};

// 반복 일정의 다음 날짜 계산
export const getNextOccurrence = (task) => {
  const now = new Date();
  const taskDate = new Date(task.dateTime);
  
  switch (task.repeatType) {
    case 'none':
      return taskDate;
      
    case 'nextWeekOnce':
      if (isBefore(taskDate, now)) {
        return null; // 지난 일회성 일정
      }
      return taskDate;
      
    case 'weekly': {
      // 선택된 요일들 중 가장 빠른 다음 날짜 찾기
      const selectedDays = task.repeatDays || [];
      let nearestDate = null;
      
      for (let i = 0; i < 7; i++) {
        const checkDate = addDays(now, i);
        const dayOfWeek = getDay(checkDate);
        
        if (selectedDays.includes(dayOfWeek)) {
          const targetDate = new Date(checkDate);
          targetDate.setHours(taskDate.getHours());
          targetDate.setMinutes(taskDate.getMinutes());
          
          if (isAfter(targetDate, now) || (i === 0 && isSameDay(targetDate, now) && isAfter(targetDate, now))) {
            nearestDate = targetDate;
            break;
          }
        }
      }
      
      // 이번 주에 없으면 다음 주 첫 번째 선택 요일
      if (!nearestDate && selectedDays.length > 0) {
        const firstDay = Math.min(...selectedDays);
        nearestDate = addWeeks(setDay(startOfWeek(now), firstDay), 1);
        nearestDate.setHours(taskDate.getHours());
        nearestDate.setMinutes(taskDate.getMinutes());
      }
      
      return nearestDate;
    }
      
    case 'monthly': {
      // 선택된 날짜들 중 가장 빠른 다음 날짜 찾기
      const selectedDates = task.repeatDates || [];
      let nearestDate = null;
      
      for (const date of selectedDates.sort((a, b) => a - b)) {
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), date);
        thisMonth.setHours(taskDate.getHours());
        thisMonth.setMinutes(taskDate.getMinutes());
        
        if (isAfter(thisMonth, now)) {
          nearestDate = thisMonth;
          break;
        }
      }
      
      // 이번 달에 없으면 다음 달 첫 번째 선택 날짜
      if (!nearestDate && selectedDates.length > 0) {
        const firstDate = Math.min(...selectedDates);
        nearestDate = new Date(now.getFullYear(), now.getMonth() + 1, firstDate);
        nearestDate.setHours(taskDate.getHours());
        nearestDate.setMinutes(taskDate.getMinutes());
      }
      
      return nearestDate;
    }
      
    case 'yearly': {
      const thisYear = new Date(taskDate);
      thisYear.setFullYear(now.getFullYear());
      
      if (isBefore(thisYear, now)) {
        thisYear.setFullYear(now.getFullYear() + 1);
      }
      
      return thisYear;
    }
      
    default:
      return taskDate;
  }
};

// 오늘 날짜의 할 일 필터링
export const filterTodayTasks = (tasks) => {
  const today = new Date();
  return tasks.filter(task => {
    const nextOccurrence = getNextOccurrence(task);
    return nextOccurrence && isSameDay(nextOccurrence, today);
  });
};

// 특정 날짜의 할 일 필터링
export const filterTasksByDate = (tasks, date) => {
  return tasks.filter(task => {
    const nextOccurrence = getNextOccurrence(task);
    return nextOccurrence && isSameDay(nextOccurrence, date);
  });
};

// 날짜 범위 생성 (캘린더용)
export const generateDateRange = (startDate, days) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
};

// 월의 날짜들 생성 (1-31)
export const generateMonthDates = () => {
  return Array.from({ length: 31 }, (_, i) => i + 1);
};
