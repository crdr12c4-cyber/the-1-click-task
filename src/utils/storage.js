import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TASKS: '@tasks',
  TAGS: '@tags',
  IS_PREMIUM: '@isPremium',
  SETTINGS: '@settings',
};

// 할 일 관련
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

export const loadTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// 태그 관련
export const saveTags = async (tags) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    return true;
  } catch (error) {
    console.error('Error saving tags:', error);
    return false;
  }
};

export const loadTags = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tags:', error);
    return [];
  }
};

// 프리미엄 상태
export const saveIsPremium = async (isPremium) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, JSON.stringify(isPremium));
    return true;
  } catch (error) {
    console.error('Error saving premium status:', error);
    return false;
  }
};

export const loadIsPremium = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('Error loading premium status:', error);
    return false;
  }
};

// 설정
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      notificationsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      notificationsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
  }
};

// 전체 데이터 초기화 (개발/디버그용)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
