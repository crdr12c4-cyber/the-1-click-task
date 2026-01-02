import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { HorizontalDatePicker } from '../components/DatePicker';
import { formatDate, getNextOccurrence } from '../utils/dateUtils';
import { isSameDay } from 'date-fns';

export const HomeScreen = ({ navigation }) => {
  const { tasks, tags, isTaskCompletedOnDate, toggleTaskComplete } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 선택된 날짜의 할 일 필터링
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const nextOccurrence = getNextOccurrence(task);
      return nextOccurrence && isSameDay(nextOccurrence, selectedDate);
    }).sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  }, [tasks, selectedDate]);

  // 완료/미완료 분리
  const { completedTasks, incompleteTasks } = useMemo(() => {
    const completed = [];
    const incomplete = [];
    
    filteredTasks.forEach(task => {
      if (isTaskCompletedOnDate(task, selectedDate)) {
        completed.push(task);
      } else {
        incomplete.push(task);
      }
    });
    
    return { completedTasks: completed, incompleteTasks: incomplete };
  }, [filteredTasks, selectedDate, isTaskCompletedOnDate]);

  const getTagById = (tagId) => tags.find(t => t.id === tagId);

  const handleToggleComplete = async (taskId) => {
    await toggleTaskComplete(taskId, selectedDate);
  };

  const renderTaskItem = ({ item }) => (
    <TaskCard
      task={item}
      tag={getTagById(item.tagId)}
      isCompleted={isTaskCompletedOnDate(item, selectedDate)}
      onToggleComplete={() => handleToggleComplete(item.id)}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>할 일이 없어요</Text>
      <Text style={styles.emptySubtitle}>
        새로운 할 일을 추가해보세요
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.emptyButtonText}>+ 할 일 추가</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = (title, count) => (
    <Text style={styles.sectionTitle}>{title} {count}개</Text>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The 1-Click Task</Text>
        <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
      </View>

      {/* 날짜 선택 */}
      <HorizontalDatePicker
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* 할 일 목록 */}
      {filteredTasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[...incompleteTasks, ...completedTasks]}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            incompleteTasks.length > 0 
              ? renderSectionHeader('할 일', incompleteTasks.length)
              : null
          }
        />
      )}

      {/* 완료된 항목 구분선 */}
      {completedTasks.length > 0 && incompleteTasks.length > 0 && (
        <View style={styles.completedDivider}>
          {renderSectionHeader('완료됨', completedTasks.length)}
        </View>
      )}

      {/* 추가 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask', { selectedDate: selectedDate.toISOString() })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerDate: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  completedDivider: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  emptyButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: Colors.textOnPrimary,
    fontWeight: '300',
    marginTop: -2,
  },
});
