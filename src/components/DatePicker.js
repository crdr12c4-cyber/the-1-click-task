import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { formatShortDate, generateDateRange } from '../utils/dateUtils';
import { addDays, isToday, isSameDay } from 'date-fns';

// 수평 날짜 선택기 (홈 화면용)
export const HorizontalDatePicker = ({ 
  selectedDate, 
  onSelectDate,
  days = 14,
}) => {
  const today = new Date();
  const dates = generateDateRange(today, days);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalContainer}
      contentContainerStyle={styles.horizontalContent}
    >
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate);
        const isTodayDate = isToday(date);
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateItem,
              isSelected && styles.dateItemSelected,
              isTodayDate && !isSelected && styles.dateItemToday,
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Text
              style={[
                styles.dateWeekday,
                isSelected && styles.dateTextSelected,
              ]}
            >
              {formatShortDate(date).split(' ')[1].replace('(', '').replace(')', '')}
            </Text>
            <Text
              style={[
                styles.dateDay,
                isSelected && styles.dateTextSelected,
              ]}
            >
              {date.getDate()}
            </Text>
            {isTodayDate && (
              <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// 요일 선택기 (매주 반복용)
export const WeekdaySelector = ({
  selectedDays = [],
  onSelectDays,
  disabled = false,
}) => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const toggleDay = (index) => {
    if (disabled) return;
    
    const newSelected = selectedDays.includes(index)
      ? selectedDays.filter(d => d !== index)
      : [...selectedDays, index];
    onSelectDays(newSelected);
  };

  return (
    <View style={styles.weekdayContainer}>
      {weekdays.map((day, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.weekdayItem,
              isSelected && styles.weekdayItemSelected,
              disabled && styles.weekdayItemDisabled,
            ]}
            onPress={() => toggleDay(index)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.weekdayText,
                isSelected && styles.weekdayTextSelected,
                disabled && styles.weekdayTextDisabled,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// 월간 날짜 선택기 (매월 반복용)
export const MonthDateSelector = ({
  selectedDates = [],
  onSelectDates,
  maxSelections = Infinity,
  disabled = false,
}) => {
  const toggleDate = (date) => {
    if (disabled) return;
    
    const isSelected = selectedDates.includes(date);
    
    if (isSelected) {
      onSelectDates(selectedDates.filter(d => d !== date));
    } else {
      if (selectedDates.length >= maxSelections) {
        // 최대 선택 개수 초과 시 가장 오래된 것 제거하고 새로 추가
        const newDates = [...selectedDates.slice(1), date];
        onSelectDates(newDates);
      } else {
        onSelectDates([...selectedDates, date]);
      }
    }
  };

  return (
    <View style={styles.monthContainer}>
      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
        const isSelected = selectedDates.includes(date);
        return (
          <TouchableOpacity
            key={date}
            style={[
              styles.monthDateItem,
              isSelected && styles.monthDateItemSelected,
              disabled && styles.monthDateItemDisabled,
            ]}
            onPress={() => toggleDate(date)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.monthDateText,
                isSelected && styles.monthDateTextSelected,
                disabled && styles.monthDateTextDisabled,
              ]}
            >
              {date}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // Horizontal Date Picker
  horizontalContainer: {
    marginVertical: Spacing.md,
  },
  horizontalContent: {
    paddingHorizontal: Spacing.lg,
  },
  dateItem: {
    width: 50,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dateItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateItemToday: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  dateWeekday: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateDay: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dateTextSelected: {
    color: Colors.textOnPrimary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: Spacing.xs,
  },
  todayDotSelected: {
    backgroundColor: Colors.textOnPrimary,
  },

  // Weekday Selector
  weekdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdayItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  weekdayItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  weekdayItemDisabled: {
    opacity: 0.5,
  },
  weekdayText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  weekdayTextSelected: {
    color: Colors.textOnPrimary,
  },
  weekdayTextDisabled: {
    color: Colors.textTertiary,
  },

  // Month Date Selector
  monthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  monthDateItem: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0.5%',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceVariant,
  },
  monthDateItemSelected: {
    backgroundColor: Colors.primary,
  },
  monthDateItemDisabled: {
    opacity: 0.5,
  },
  monthDateText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  monthDateTextSelected: {
    color: Colors.textOnPrimary,
  },
  monthDateTextDisabled: {
    color: Colors.textTertiary,
  },
});
