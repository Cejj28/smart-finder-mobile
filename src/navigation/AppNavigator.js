import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import MyPostsScreen from '../screens/MyPostsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Home: { active: 'home', inactive: 'home-outline' },
    Report: { active: 'add-circle', inactive: 'add-circle-outline' },
    'My Posts': { active: 'document-text', inactive: 'document-text-outline' },
    Notifications: { active: 'notifications', inactive: 'notifications-outline' },
    Profile: { active: 'person', inactive: 'person-outline' },
};

export default function AppNavigator({ onLogout }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.primary,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: FONT_SIZES.lg,
                },
                headerTitle: route.name === 'Home' ? 'SmartFinder' : route.name,
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons.active : icons.inactive;
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                    backgroundColor: COLORS.white,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    ...SHADOWS.sm,
                },
                tabBarLabelStyle: {
                    fontSize: FONT_SIZES.xs,
                    fontWeight: FONT_WEIGHTS.semibold,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Report" component={ReportScreen} />
            <Tab.Screen name="My Posts" component={MyPostsScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile">
                {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
