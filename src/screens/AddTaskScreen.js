import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Input, Button, TagSelector, PremiumModal } from '../components/common';
import { SimpleTimePicker } from '../components/TimePicker';
import { WeekdaySelector, MonthDateSelector } from '../components/DatePicker';
import { REPEAT_TYPES, REPEAT_LABELS, DEFAULT_REMINDER_OPTIONS, FREE_LIMITS } from '../constants/limits';
import { roundToNearestFiveMinutes, formatDate } from '../utils/dateUtils';

export const AddTaskScreen = ({ navigation, route }) => {
  const { addTask, updateTask, tags, isPremium, canAddRepeatingTask, limits } = useApp();
  const editTask = route.params?.task;
  const initialDate = route.params?.selectedDate 
    ? new Date(route.params.selectedDate) 
    : new Date();

  // 폼 상태
  const [title, setTitle] = useState(editTask?.title || '');
  const [dateTime, setDateTime] = useState(
    editTask ? new Date(editTask.dateTime) : roundToNearestFiveMinutes(initialDate)
  );
  const [repeatType, setRepeatType] = useState(editTask?.repeatType || REPEAT_TYPES.NONE);
  const [repeatDays, setRepeatDays] = useState(editTask?.repeatDays || []);
  const [repeatDates, setRepeatDates] = useState(editTask?.repeatDates || []);
  const [selectedTagId, setSelectedTagId] = useState(editTask?.tagId || null);
  const [startAlarm, setStartAlarm] = useState(editTask?.startAlarm ?? true);
  const [reminders, setReminders] = useState(editTask?.reminders || []);
  
  // UI 상태
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 반복 타입 변경 핸들러
  const handleRepeatTypeChange = (type) => {
    // 무료 사용자가 반복 일정을 추가하려고 할 때
    if (type !== REPEAT_TYPES.NONE && !editTask && !canAddRepeatingTask()) {
      setPremiumFeature('REPEAT_LIMIT');
      setShowPremiumModal(true);
      return;
    }
    
    setRepeatType(type);
    setShowRepeatOptions(false);
    
    // 타입 변경 시 선택 초기화
    if (type !== REPEAT_TYPES.WEEKLY) setRepeatDays([]);
    if (type !== REPEAT_TYPES.MONTHLY) setRepeatDates([]);
  };

  // 매월 날짜 선택 핸들러
  const handleMonthDatesChange = (dates) => {
    const maxDates = isPremium ? Infinity : FREE_LIMITS.maxMonthlyDates;
    
    if (dates.length > maxDates && !isPremium) {
      setPremiumFeature('MONTHLY_DATE_LIMIT');
      setShowPremiumModal(true);
      return;
    }
    
    setRepeatDates(dates);
  };

  // 미리 알림 토글
  const toggleReminder = (reminder) => {
    const exists = reminders.find(
      r => r.type === reminder.type && r.value === reminder.value
    );
    
    if (exists) {
      setReminders(reminders.filter(
        r => !(r.type === reminder.type && r.value === reminder.value)
      ));
    } else {
      setReminders([...reminders, { type: reminder.type, value: reminder.value }]);
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '할 일 제목을 입력해주세요.');
      return;
    }

    // 매주 반복인데 요일 미선택
    if (repeatType === REPEAT_TYPES.WEEKLY && repeatDays.length === 0) {
      Alert.alert('알림', '반복할 요일을 선택해주세요.');
      return;
    }

    // 매월 반복인데 날짜 미선택
    if (repeatType === REPEAT_TYPES.MONTHLY && repeatDates.length === 0) {
      Alert.alert('알림', '반복할 날짜를 선택해주세요.');
      return;
    }

    setIsLoading(true);

    const taskData = {
      title: title.trim(),
      dateTime: dateTime.toISOString(),
      repeatType,
      repeatDays: repeatType === REPEAT_TYPES.WEEKLY ? repeatDays : [],
      repeatDates: repeatType === REPEAT_TYPES.MONTHLY ? repeatDates : [],
      tagId: selectedTagId,
      startAlarm,
      reminders,
    };

    let result;
    if (editTask) {
      result = await updateTask(editTask.id, taskData);
    } else {
      result = await addTask(taskData);
    }

    setIsLoading(false);

    if (result.success) {
      navigation.goBack();
    } else if (result.error === 'REPEAT_LIMIT') {
      setPremiumFeature('REPEAT_LIMIT');
      setShowPremiumModal(true);
    } else {
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editTask ? '할 일 수정' : '새 할 일'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveText, isLoading && styles.disabledText]}>
              저장
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 제목 입력 */}
          <Input
            label="할 일"
            value={title}
            onChangeText={setTitle}
            placeholder="할 일을 입력하세요"
            autoFocus={!editTask}
          />

          {/* 시간 설정 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>시간</Text>
            <SimpleTimePicker
              value={dateTime}
              onChange={setDateTime}
            />
          </View>

          {/* 반복 설정 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>반복</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowRepeatOptions(!showRepeatOptions)}
            >
              <Text style={styles.selectButtonText}>
                {REPEAT_LABELS[repeatType]}
              </Text>
              <Text style={styles.selectArrow}>
                {showRepeatOptions ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showRepeatOptions && (
              <View style={styles.optionsContainer}>
                {Object.entries(REPEAT_LABELS).map(([type, label]) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionItem,
                      repeatType === type && styles.optionItemSelected,
                    ]}
                    onPress={() => handleRepeatTypeChange(type)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        repeatType === type && styles.optionTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                    {repeatType === type && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 매주 요일 선택 */}
            {repeatType === REPEAT_TYPES.WEEKLY && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>반복할 요일</Text>
                <WeekdaySelector
                  selectedDays={repeatDays}
                  onSelectDays={setRepeatDays}
                />
              </View>
            )}

            {/* 매월 날짜 선택 */}
            {repeatType === REPEAT_TYPES.MONTHLY && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>
                  반복할 날짜 
                  {!isPremium && (
                    <Text style={styles.limitText}> (무료: 1개)</Text>
                  )}
                </Text>
                <MonthDateSelector
                  selectedDates={repeatDates}
                  onSelectDates={handleMonthDatesChange}
                  maxSelections={isPremium ? Infinity : FREE_LIMITS.maxMonthlyDates}
                />
              </View>
            )}
          </View>

          {/* 태그 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>태그</Text>
            {tags.length > 0 ? (
              <TagSelector
                tags={tags}
                selectedTagId={selectedTagId}
                onSelectTag={setSelectedTagId}
              />
            ) : (
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={() => navigation.navigate('Tags')}
              >
                <Text style={styles.addTagText}>+ 태그 추가하기</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 시작 알람 */}
          <View style={styles.switchSection}>
            <View>
              <Text style={styles.switchLabel}>시작할 때 알람</Text>
              <Text style={styles.switchDescription}>
                설정한 시간에 알림을 받아요
              </Text>
            </View>
            <Switch
              value={startAlarm}
              onValueChange={setStartAlarm}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={startAlarm ? Colors.primary : Colors.textTertiary}
            />
          </View>

          {/* 미리 알림 */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowReminderOptions(!showReminderOptions)}
            >
              <Text style={styles.sectionLabel}>미리 알림</Text>
              <Text style={styles.reminderCount}>
                {reminders.length > 0 ? `${reminders.length}개 설정됨` : '없음'}
              </Text>
            </TouchableOpacity>

            {showReminderOptions && (
              <View style={styles.reminderOptions}>
                {DEFAULT_REMINDER_OPTIONS.map((option, index) => {
                  const isSelected = reminders.some(
                    r => r.type === option.type && r.value === option.value
                  );
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.reminderOption,
                        isSelected && styles.reminderOptionSelected,
                      ]}
                      onPress={() => toggleReminder(option)}
                    >
                      <Text
                        style={[
                          styles.reminderOptionText,
                          isSelected && styles.reminderOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 프리미엄 모달 */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        feature={premiumFeature}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cancelText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  saveText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  selectButtonText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  selectArrow: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  optionsContainer: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '700',
  },
  subSection: {
    marginTop: Spacing.lg,
  },
  subSectionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  limitText: {
    color: Colors.textTertiary,
    fontSize: FontSize.xs,
  },
  addTagButton: {
    padding: Spacing.md,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  addTagText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  switchDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  reminderCount: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  reminderOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  reminderOptionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  reminderOptionText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  reminderOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 50,
  },
});
