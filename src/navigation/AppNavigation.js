import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';
import { 
  HomeScreen, 
  AddTaskScreen, 
  TaskDetailScreen, 
  TagsScreen, 
  SettingsScreen 
} from '../screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 탭 아이콘 컴포넌트
const TabIcon = ({ icon, focused }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icon}
    </Text>
  </View>
);

// 홈 탭 스택
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
    <Stack.Screen 
      name="AddTask" 
      component={AddTaskScreen} 
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name="Tags" component={TagsScreen} />
  </Stack.Navigator>
);

// 설정 탭 스택
const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    <Stack.Screen name="Tags" component={TagsScreen} />
  </Stack.Navigator>
);

// 메인 탭 네비게이터
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textTertiary,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: '홈',
        tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStack}
      options={{
        tabBarLabel: '설정',
        tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// 앱 네비게이션
export const AppNavigation = () => (
  <NavigationContainer>
    <MainTabs />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderLight,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
