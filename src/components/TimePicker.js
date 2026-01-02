import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

export const TimePicker = ({ 
  value, // Date object
  onChange,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 5분 단위

  const currentHour = value.getHours();
  const currentMinute = Math.round(value.getMinutes() / 5) * 5;

  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);

  useEffect(() => {
    // 초기 스크롤 위치 설정
    setTimeout(() => {
      hourScrollRef.current?.scrollTo({
        y: currentHour * ITEM_HEIGHT,
        animated: false,
      });
      minuteScrollRef.current?.scrollTo({
        y: (currentMinute / 5) * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  const handleHourChange = (hour) => {
    const newDate = new Date(value);
    newDate.setHours(hour);
    onChange(newDate);
  };

  const handleMinuteChange = (minute) => {
    const newDate = new Date(value);
    newDate.setMinutes(minute);
    onChange(newDate);
  };

  const handleHourScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < hours.length) {
      handleHourChange(hours[index]);
    }
  };

  const handleMinuteScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < minutes.length) {
      handleMinuteChange(minutes[index]);
    }
  };

  const renderPickerColumn = (data, selectedValue, scrollRef, onScroll, formatFn) => (
    <View style={styles.column}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onScroll}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {data.map((item, index) => {
          const isSelected = item === selectedValue;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => {
                scrollRef.current?.scrollTo({
                  y: index * ITEM_HEIGHT,
                  animated: true,
                });
              }}
            >
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {formatFn(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.selectionIndicator} pointerEvents="none" />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderPickerColumn(
        hours,
        currentHour,
        hourScrollRef,
        handleHourScroll,
        (h) => h.toString().padStart(2, '0')
      )}
      <Text style={styles.separator}>:</Text>
      {renderPickerColumn(
        minutes,
        currentMinute,
        minuteScrollRef,
        handleMinuteScroll,
        (m) => m.toString().padStart(2, '0')
      )}
    </View>
  );
};

// 간단한 버튼 스타일 시간 선택
export const SimpleTimePicker = ({
  value,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const currentHour = value.getHours();
  const currentMinute = Math.round(value.getMinutes() / 5) * 5;

  const adjustTime = (type, delta) => {
    const newDate = new Date(value);
    
    if (type === 'hour') {
      let newHour = currentHour + delta;
      if (newHour < 0) newHour = 23;
      if (newHour > 23) newHour = 0;
      newDate.setHours(newHour);
    } else {
      let newMinute = currentMinute + delta * 5;
      if (newMinute < 0) {
        newMinute = 55;
        newDate.setHours(currentHour - 1);
      }
      if (newMinute >= 60) {
        newMinute = 0;
        newDate.setHours(currentHour + 1);
      }
      newDate.setMinutes(newMinute);
    }
    
    onChange(newDate);
  };

  return (
    <View style={styles.simpleContainer}>
      <View style={styles.simpleColumn}>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => adjustTime('hour', 1)}
        >
          <Text style={styles.arrowText}>▲</Text>
        </TouchableOpacity>
        <Text style={styles.simpleValue}>
          {currentHour.toString().padStart(2, '0')}
        </Text>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => adjustTime('hour', -1)}
        >
          <Text style={styles.arrowText}>▼</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.simpleSeparator}>:</Text>
      
      <View style={styles.simpleColumn}>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => adjustTime('minute', 1)}
        >
          <Text style={styles.arrowText}>▲</Text>
        </TouchableOpacity>
        <Text style={styles.simpleValue}>
          {currentMinute.toString().padStart(2, '0')}
        </Text>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => adjustTime('minute', -1)}
        >
          <Text style={styles.arrowText}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  column: {
    width: 70,
    height: '100%',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {},
  itemText: {
    fontSize: FontSize.xl,
    color: Colors.textTertiary,
  },
  itemTextSelected: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    zIndex: -1,
  },
  separator: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: Spacing.sm,
  },

  // Simple Time Picker
  simpleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  simpleColumn: {
    alignItems: 'center',
  },
  arrowButton: {
    padding: Spacing.sm,
  },
  arrowText: {
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  simpleValue: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },
  simpleSeparator: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: Spacing.md,
  },
});
