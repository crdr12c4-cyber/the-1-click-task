import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { CompletionCheckbox } from './common/Checkbox';
import { TagBadge } from './common/TagBadge';
import { formatTime } from '../utils/dateUtils';
import { REPEAT_LABELS, REPEAT_TYPES } from '../constants/limits';

export const TaskCard = ({
  task,
  tag,
  isCompleted,
  onToggleComplete,
  onPress,
}) => {
  const hasRepeat = task.repeatType && task.repeatType !== REPEAT_TYPES.NONE;

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CompletionCheckbox
        completed={isCompleted}
        onPress={onToggleComplete}
      />
      
      <View style={styles.content}>
        <Text 
          style={[styles.title, isCompleted && styles.completedTitle]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        <View style={styles.meta}>
          <Text style={styles.time}>
            {formatTime(task.dateTime)}
          </Text>
          
          {hasRepeat && (
            <View style={styles.repeatBadge}>
              <Text style={styles.repeatText}>
                🔄 {REPEAT_LABELS[task.repeatType]}
              </Text>
            </View>
          )}
          
          {task.startAlarm && (
            <Text style={styles.alarmIcon}>🔔</Text>
          )}
        </View>
        
        {tag && (
          <View style={styles.tagContainer}>
            <TagBadge tag={tag} size="small" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  completedContainer: {
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.md,
  },
  repeatBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  repeatText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  alarmIcon: {
    fontSize: FontSize.sm,
  },
  tagContainer: {
    marginTop: Spacing.sm,
  },
});
