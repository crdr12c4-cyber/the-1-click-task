import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 알림 권한 요청
export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.log('알림은 실제 기기에서만 작동합니다.');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('알림 권한이 거부되었습니다.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6B9DFC',
    });
  }

  return true;
};

// 알림 예약
export const scheduleNotification = async ({ 
  taskId, 
  title, 
  body, 
  triggerDate,
  isStartAlarm = false 
}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { taskId, isStartAlarm },
        sound: true,
      },
      trigger: {
        date: triggerDate,
      },
    });
    return notificationId;
  } catch (error) {
    console.error('알림 예약 실패:', error);
    return null;
  }
};

// 반복 알림 예약 (매주)
export const scheduleWeeklyNotification = async ({
  taskId,
  title,
  body,
  weekday, // 0-6 (일-토)
  hour,
  minute,
}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { taskId },
        sound: true,
      },
      trigger: {
        weekday: weekday + 1, // expo는 1-7 (일-토)
        hour,
        minute,
        repeats: true,
      },
    });
    return notificationId;
  } catch (error) {
    console.error('주간 알림 예약 실패:', error);
    return null;
  }
};

// 특정 알림 취소
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return true;
  } catch (error) {
    console.error('알림 취소 실패:', error);
    return false;
  }
};

// 여러 알림 취소
export const cancelMultipleNotifications = async (notificationIds) => {
  try {
    await Promise.all(
      notificationIds.map(id => Notifications.cancelScheduledNotificationAsync(id))
    );
    return true;
  } catch (error) {
    console.error('알림 일괄 취소 실패:', error);
    return false;
  }
};

// 모든 예약된 알림 취소
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error('모든 알림 취소 실패:', error);
    return false;
  }
};

// 예약된 알림 목록 가져오기
export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    return [];
  }
};

// 미리 알림 시간 계산
export const calculateReminderDate = (taskDate, reminderType, reminderValue) => {
  const date = new Date(taskDate);
  
  switch (reminderType) {
    case 'minutes':
      date.setMinutes(date.getMinutes() - reminderValue);
      break;
    case 'hours':
      date.setHours(date.getHours() - reminderValue);
      break;
    case 'days':
      date.setDate(date.getDate() - reminderValue);
      break;
    default:
      break;
  }
  
  return date;
};
