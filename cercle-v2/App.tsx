import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { FeedScreen } from './src/screens/FeedScreen';
import { WatchlistScreen } from './src/screens/WatchlistScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BottomTabBar, Tab } from './src/components/BottomTabBar';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('fil');

  const renderScreen = () => {
    if (activeTab === 'liste') return <WatchlistScreen />;
    if (activeTab === 'profil') return <ProfileScreen />;
    return <FeedScreen />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <BottomTabBar active={activeTab} onTabPress={setActiveTab} onAddPress={() => {}} />
    </View>
  );
}

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {
        // En dev local, Updates n'est pas actif
      }
    }
    checkForUpdates();
  }, []);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0D11' }}>
        <ActivityIndicator color="#F2B441" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
