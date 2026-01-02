import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const base = [styles.button, styles[`${size}Button`]];
    
    switch (variant) {
      case 'secondary':
        base.push(styles.secondaryButton);
        break;
      case 'outline':
        base.push(styles.outlineButton);
        break;
      case 'text':
        base.push(styles.textButton);
        break;
      default:
        base.push(styles.primaryButton);
    }
    
    if (disabled) base.push(styles.disabledButton);
    
    return base;
  };

  const getTextStyle = () => {
    const base = [styles.buttonText, styles[`${size}Text`]];
    
    switch (variant) {
      case 'secondary':
        base.push(styles.secondaryText);
        break;
      case 'outline':
        base.push(styles.outlineText);
        break;
      case 'text':
        base.push(styles.textOnlyText);
        break;
      default:
        base.push(styles.primaryText);
    }
    
    if (disabled) base.push(styles.disabledText);
    
    return base;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.textOnPrimary : Colors.primary} 
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  
  // Sizes
  smallButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  mediumButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  largeButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.primaryLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  
  // Text
  buttonText: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: FontSize.sm,
  },
  mediumText: {
    fontSize: FontSize.md,
  },
  largeText: {
    fontSize: FontSize.lg,
  },
  
  primaryText: {
    color: Colors.textOnPrimary,
  },
  secondaryText: {
    color: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  textOnlyText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
});
