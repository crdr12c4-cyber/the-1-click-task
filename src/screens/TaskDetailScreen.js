import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Card, TagBadge, CompletionCheckbox } from '../components/common';
import { formatDateTime, formatDate, getNextOccurrence } from '../utils/dateUtils';
import { REPEAT_LABELS, REPEAT_TYPES, WEEKDAYS } from '../constants/limits';

export const TaskDetailScreen = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { tasks, tags, deleteTask, toggleTaskComplete, isTaskCompletedOnDate } = useApp();
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>할 일을 찾을 수 없습니다</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.goBackText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tag = tags.find(t => t.id === task.tagId);
  const nextOccurrence = getNextOccurrence(task);
  const isCompleted = nextOccurrence ? isTaskCompletedOnDate(task, nextOccurrence) : false;

  const handleDelete = () => {
    Alert.alert(
      '할 일 삭제',
      '이 할 일을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    if (nextOccurrence) {
      await toggleTaskComplete(taskId, nextOccurrence);
    }
  };

  const getRepeatDescription = () => {
    if (task.repeatType === REPEAT_TYPES.NONE) return '반복 없음';
    
    let desc = REPEAT_LABELS[task.repeatType];
    
    if (task.repeatType === REPEAT_TYPES.WEEKLY && task.repeatDays?.length > 0) {
      const dayNames = task.repeatDays
        .sort((a, b) => a - b)
        .map(d => WEEKDAYS[d].label)
        .join(', ');
      desc += ` (${dayNames})`;
    }
    
    if (task.repeatType === REPEAT_TYPES.MONTHLY && task.repeatDates?.length > 0) {
      const dates = task.repeatDates.sort((a, b) => a - b).join(', ');
      desc += ` (${dates}일)`;
    }
    
    return desc;
  };

  const getReminderDescription = () => {
    if (!task.reminders || task.reminders.length === 0) return '없음';
    
    return task.reminders.map(r => {
      if (r.type === 'minutes') return `${r.value}분 전`;
      if (r.type === 'hours') return `${r.value}시간 전`;
      if (r.type === 'days') return `${r.value}일 전`;
      return '';
    }).join(', ');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('AddTask', { task })}
          >
            <Text style={styles.editText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 카드 */}
        <Card variant="elevated" style={styles.mainCard}>
          <View style={styles.titleRow}>
            <CompletionCheckbox
              completed={isCompleted}
              onPress={handleToggleComplete}
              size={32}
            />
            <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
              {task.title}
            </Text>
          </View>

          {tag && (
            <View style={styles.tagRow}>
              <TagBadge tag={tag} />
            </View>
          )}
        </Card>

        {/* 상세 정보 */}
        <Card style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 다음 일정</Text>
            <Text style={styles.detailValue}>
              {nextOccurrence ? formatDateTime(nextOccurrence) : '-'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🔄 반복</Text>
            <Text style={styles.detailValue}>{getRepeatDescription()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🔔 시작 알림</Text>
            <Text style={styles.detailValue}>
              {task.startAlarm ? '켜짐' : '꺼짐'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ 미리 알림</Text>
            <Text style={styles.detailValue}>{getReminderDescription()}</Text>
          </View>
        </Card>

        {/* 완료 기록 */}
        {task.completedDates && task.completedDates.length > 0 && (
          <Card style={styles.historyCard}>
            <Text style={styles.historyTitle}>완료 기록</Text>
            <View style={styles.historyList}>
              {task.completedDates
                .slice(-10)
                .reverse()
                .map((date, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyCheck}>✓</Text>
                    <Text style={styles.historyDate}>
                      {formatDate(date)}
                    </Text>
                  </View>
                ))}
            </View>
            {task.completedDates.length > 10 && (
              <Text style={styles.historyMore}>
                외 {task.completedDates.length - 10}개 더...
              </Text>
            )}
          </Card>
        )}

        {/* 생성일 */}
        <Text style={styles.createdAt}>
          생성일: {formatDate(task.createdAt)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  backText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: Spacing.lg,
  },
  editText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  deleteText: {
    fontSize: FontSize.md,
    color: Colors.error,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  mainCard: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    lineHeight: 28,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  tagRow: {
    marginTop: Spacing.md,
    marginLeft: 44,
  },
  detailCard: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  historyCard: {
    marginBottom: Spacing.lg,
  },
  historyTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  historyList: {},
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  historyCheck: {
    fontSize: FontSize.md,
    color: Colors.success,
    marginRight: Spacing.sm,
  },
  historyDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  historyMore: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  createdAt: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  goBackText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
});
