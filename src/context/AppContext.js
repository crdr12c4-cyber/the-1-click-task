import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveTasks, loadTasks, saveTags, loadTags, saveIsPremium, loadIsPremium } from '../utils/storage';
import { FREE_LIMITS, PREMIUM_LIMITS, REPEAT_TYPES } from '../constants/limits';
import { 
  scheduleNotification, 
  cancelNotification, 
  cancelMultipleNotifications,
  calculateReminderDate,
  requestNotificationPermissions
} from '../utils/notifications';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [loadedTasks, loadedTags, loadedPremium] = await Promise.all([
          loadTasks(),
          loadTags(),
          loadIsPremium(),
        ]);
        
        setTasks(loadedTasks);
        setTags(loadedTags);
        setIsPremium(loadedPremium);
        
        // 알림 권한 요청
        await requestNotificationPermissions();
      } catch (error) {
        console.error('앱 초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 현재 제한 값
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  // 반복 일정 개수 확인
  const getRepeatingTasksCount = () => {
    return tasks.filter(task => task.repeatType !== REPEAT_TYPES.NONE).length;
  };

  // 반복 일정 추가 가능 여부
  const canAddRepeatingTask = () => {
    return isPremium || getRepeatingTasksCount() < limits.maxRepeatingTasks;
  };

  // 태그 추가 가능 여부
  const canAddTag = () => {
    return isPremium || tags.length < limits.maxTags;
  };

  // 할 일 추가
  const addTask = async (taskData) => {
    // 반복 일정 제한 체크
    if (taskData.repeatType !== REPEAT_TYPES.NONE && !canAddRepeatingTask()) {
      return { success: false, error: 'REPEAT_LIMIT' };
    }

    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [], // 완료된 날짜들 기록
      notificationIds: [], // 알림 ID들
    };

    // 알림 예약
    const notificationIds = await scheduleTaskNotifications(newTask);
    newTask.notificationIds = notificationIds;

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    return { success: true, task: newTask };
  };

  // 할 일 수정
  const updateTask = async (taskId, updates) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return { success: false, error: 'NOT_FOUND' };

    const oldTask = tasks[taskIndex];
    
    // 반복 타입 변경 시 제한 체크
    if (updates.repeatType && 
        updates.repeatType !== REPEAT_TYPES.NONE && 
        oldTask.repeatType === REPEAT_TYPES.NONE && 
        !canAddRepeatingTask()) {
      return { success: false, error: 'REPEAT_LIMIT' };
    }

    // 기존 알림 취소
    if (oldTask.notificationIds?.length > 0) {
      await cancelMultipleNotifications(oldTask.notificationIds);
    }

    const updatedTask = { ...oldTask, ...updates };
    
    // 새 알림 예약
    const notificationIds = await scheduleTaskNotifications(updatedTask);
    updatedTask.notificationIds = notificationIds;

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    return { success: true, task: updatedTask };
  };

  // 할 일 삭제
  const deleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.notificationIds?.length > 0) {
      await cancelMultipleNotifications(task.notificationIds);
    }

    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    return { success: true };
  };

  // 완료 토글
  const toggleTaskComplete = async (taskId, date) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return { success: false };

    const task = tasks[taskIndex];
    const dateStr = new Date(date).toDateString();
    
    let completedDates = [...(task.completedDates || [])];
    const existingIndex = completedDates.findIndex(d => new Date(d).toDateString() === dateStr);
    
    if (existingIndex >= 0) {
      completedDates.splice(existingIndex, 1);
    } else {
      completedDates.push(new Date(date).toISOString());
    }

    const updatedTask = { ...task, completedDates };
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;

    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    return { success: true, isCompleted: existingIndex < 0 };
  };

  // 특정 날짜에 완료 여부 확인
  const isTaskCompletedOnDate = (task, date) => {
    const dateStr = new Date(date).toDateString();
    return (task.completedDates || []).some(d => new Date(d).toDateString() === dateStr);
  };

  // 태그 추가
  const addTag = async (tagData) => {
    if (!canAddTag()) {
      return { success: false, error: 'TAG_LIMIT' };
    }

    const newTag = {
      ...tagData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    await saveTags(updatedTags);

    return { success: true, tag: newTag };
  };

  // 태그 수정
  const updateTag = async (tagId, updates) => {
    const tagIndex = tags.findIndex(t => t.id === tagId);
    if (tagIndex === -1) return { success: false };

    const updatedTags = [...tags];
    updatedTags[tagIndex] = { ...updatedTags[tagIndex], ...updates };

    setTags(updatedTags);
    await saveTags(updatedTags);

    return { success: true };
  };

  // 태그 삭제
  const deleteTag = async (tagId) => {
    const updatedTags = tags.filter(t => t.id !== tagId);
    setTags(updatedTags);
    await saveTags(updatedTags);

    // 해당 태그를 사용하는 할일에서 태그 제거
    const updatedTasks = tasks.map(task => ({
      ...task,
      tagId: task.tagId === tagId ? null : task.tagId,
    }));
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    return { success: true };
  };

  // 프리미엄 업그레이드
  const upgradeToPremium = async () => {
    setIsPremium(true);
    await saveIsPremium(true);
  };

  // 알림 예약 헬퍼
  const scheduleTaskNotifications = async (task) => {
    const notificationIds = [];

    // 시작 알림 (시작할 때 알람 설정된 경우)
    if (task.startAlarm) {
      const id = await scheduleNotification({
        taskId: task.id,
        title: '할 일 시작',
        body: task.title,
        triggerDate: new Date(task.dateTime),
        isStartAlarm: true,
      });
      if (id) notificationIds.push(id);
    }

    // 미리 알림들
    if (task.reminders?.length > 0) {
      for (const reminder of task.reminders) {
        let triggerDate;
        
        if (reminder.type === 'specificDate') {
          triggerDate = new Date(reminder.specificDate);
        } else {
          triggerDate = calculateReminderDate(task.dateTime, reminder.type, reminder.value);
        }

        if (triggerDate > new Date()) {
          const id = await scheduleNotification({
            taskId: task.id,
            title: '미리 알림',
            body: task.title,
            triggerDate,
          });
          if (id) notificationIds.push(id);
        }
      }
    }

    return notificationIds;
  };

  return (
    <AppContext.Provider
      value={{
        // 상태
        tasks,
        tags,
        isPremium,
        isLoading,
        limits,
        
        // 할 일 관련
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        isTaskCompletedOnDate,
        getRepeatingTasksCount,
        canAddRepeatingTask,
        
        // 태그 관련
        addTag,
        updateTag,
        deleteTag,
        canAddTag,
        
        // 프리미엄
        upgradeToPremium,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
