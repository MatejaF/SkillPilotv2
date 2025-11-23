import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
      <Tabs.Screen name="home" options={{ title: 'Domov' }} />
      <Tabs.Screen name="saved" options={{ title: 'Shranjeno' }} />
    </Tabs>
  );
}
