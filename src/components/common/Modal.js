import React from 'react';
import { View, Text, Modal as RNModal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

export const Modal = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {showCloseButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

// 프리미엄 업그레이드 유도 모달
export const PremiumModal = ({ visible, onClose, feature }) => {
  const featureMessages = {
    REPEAT_LIMIT: '반복 일정은 1개까지만 무료예요',
    TAG_LIMIT: '태그는 3개까지만 무료예요',
    MONTHLY_DATE_LIMIT: '매월 날짜는 1개만 선택할 수 있어요',
  };

  return (
    <Modal visible={visible} onClose={onClose} title="프리미엄 기능">
      <View style={styles.premiumContent}>
        <Text style={styles.premiumEmoji}>✨</Text>
        <Text style={styles.premiumMessage}>
          {featureMessages[feature] || '이 기능은 프리미엄 전용이에요'}
        </Text>
        <Text style={styles.premiumSubtext}>
          프리미엄으로 업그레이드하면{'\n'}모든 기능을 무제한으로 사용할 수 있어요!
        </Text>
        <TouchableOpacity style={styles.premiumButton} onPress={onClose}>
          <Text style={styles.premiumButtonText}>프리미엄 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.laterText}>나중에</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 340,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeText: {
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
  },
  content: {
    padding: Spacing.lg,
  },
  
  // Premium Modal
  premiumContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  premiumEmoji: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  premiumMessage: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  premiumSubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  premiumButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  laterText: {
    color: Colors.textTertiary,
    fontSize: FontSize.md,
  },
});
