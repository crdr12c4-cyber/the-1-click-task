import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

export const Checkbox = ({ 
  checked, 
  onPress, 
  label,
  size = 'medium', // small, medium, large
  disabled = false,
}) => {
  const sizeMap = {
    small: 18,
    medium: 24,
    large: 30,
  };

  const boxSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { width: boxSize, height: boxSize },
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <Text style={[styles.checkmark, { fontSize: boxSize * 0.6 }]}>✓</Text>
        )}
      </View>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// 완료 체크용 원형 체크박스
export const CompletionCheckbox = ({ 
  completed, 
  onPress, 
  size = 28,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.completionContainer}
    >
      <View
        style={[
          styles.completionCheckbox,
          { width: size, height: size, borderRadius: size / 2 },
          completed && styles.completionChecked,
        ]}
      >
        {completed && (
          <Text style={styles.completionCheckmark}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  checked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  checkmark: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  label: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  labelDisabled: {
    color: Colors.textTertiary,
  },
  
  // Completion checkbox
  completionContainer: {
    padding: Spacing.xs,
  },
  completionCheckbox: {
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  completionChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  completionCheckmark: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
