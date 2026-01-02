import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common';
import { clearAllData } from '../utils/storage';

export const SettingsScreen = ({ navigation }) => {
  const { isPremium, upgradeToPremium, tasks, tags, getRepeatingTasksCount, limits } = useApp();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleUpgrade = () => {
    // 실제로는 결제 로직 연결
    Alert.alert(
      '프리미엄 업그레이드',
      '프리미엄 기능:\n• 무제한 반복 일정\n• 무제한 태그\n• 매월 날짜 복수 선택\n• 성과 그래프 (예정)',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '업그레이드', 
          onPress: () => {
            // TODO: 실제 결제 연동
            upgradeToPremium();
            Alert.alert('완료', '프리미엄으로 업그레이드되었습니다!');
          }
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      '데이터 초기화',
      '모든 할 일과 태그가 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '초기화', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('완료', '모든 데이터가 초기화되었습니다.\n앱을 다시 시작해주세요.');
          }
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <Text style={styles.menuArrow}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 프리미엄 배너 */}
        {!isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={handleUpgrade}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumEmoji}>✨</Text>
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>프리미엄으로 업그레이드</Text>
                <Text style={styles.premiumSubtitle}>
                  모든 기능을 무제한으로 사용하세요
                </Text>
              </View>
            </View>
            <Text style={styles.premiumArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* 사용 현황 */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>사용 현황</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tasks.length}</Text>
              <Text style={styles.statLabel}>전체 할 일</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {getRepeatingTasksCount()}
                {!isPremium && <Text style={styles.statLimit}>/{limits.maxRepeatingTasks}</Text>}
              </Text>
              <Text style={styles.statLabel}>반복 일정</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {tags.length}
                {!isPremium && <Text style={styles.statLimit}>/{limits.maxTags}</Text>}
              </Text>
              <Text style={styles.statLabel}>태그</Text>
            </View>
          </View>
        </Card>

        {/* 설정 메뉴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일반</Text>
          <Card style={styles.menuCard}>
            <MenuItem
              icon="🏷️"
              title="태그 관리"
              subtitle={`${tags.length}개의 태그`}
              onPress={() => navigation.navigate('Tags')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="🔔"
              title="알림"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={notificationsEnabled ? Colors.primary : Colors.textTertiary}
                />
              }
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <Card style={styles.menuCard}>
            <MenuItem
              icon={isPremium ? '👑' : '⭐'}
              title={isPremium ? '프리미엄 회원' : '무료 회원'}
              subtitle={isPremium ? '모든 기능 이용 가능' : '일부 기능 제한'}
              onPress={!isPremium ? handleUpgrade : undefined}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터</Text>
          <Card style={styles.menuCard}>
            <MenuItem
              icon="🗑️"
              title="데이터 초기화"
              subtitle="모든 할 일과 태그 삭제"
              onPress={handleResetData}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <Card style={styles.menuCard}>
            <MenuItem
              icon="📱"
              title="앱 버전"
              subtitle="1.0.0"
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="📄"
              title="개인정보처리방침"
              onPress={() => Linking.openURL('https://example.com/privacy')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="📋"
              title="이용약관"
              onPress={() => Linking.openURL('https://example.com/terms')}
            />
          </Card>
        </View>

        <Text style={styles.footer}>
          The 1-Click Task{'\n'}
          © 2024 All rights reserved
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  premiumSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textOnPrimary,
    opacity: 0.9,
    marginTop: 2,
  },
  premiumArrow: {
    fontSize: FontSize.xxl,
    color: Colors.textOnPrimary,
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLimit: {
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.textTertiary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  menuIcon: {
    fontSize: FontSize.xl,
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: FontSize.xxl,
    color: Colors.textTertiary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.lg + 28,
  },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginVertical: Spacing.xl,
    lineHeight: 20,
  },
});
