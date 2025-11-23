import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs

      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#9b59ff',
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Domov',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Shranjeno',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bookmark" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pilotko"
        options={{
          title: 'Pilotko',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="open-ai" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}