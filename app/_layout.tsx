import Theme from '@/constants/Theme';
import useAuth from '@/hooks/useAuth';
import SupabaseProvider from '@/shared/supabase';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  const PublicNavigator = () => {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' />
        <Stack.Screen name='signin' />
      </Stack>
    )
  }

  const PrivateNavigator = () => {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
      </Stack>
    )
  }

  const AppNavigator = () => {

    const { session } = useAuth()

    return (
      session == null ? <PublicNavigator /> : <PrivateNavigator />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SupabaseProvider>
        <PaperProvider theme={Theme}>
          <AppNavigator />
        </PaperProvider>
        <StatusBar backgroundColor={Theme.colors?.primary} style='auto' />
      </SupabaseProvider>
    </SafeAreaView>
  );
}
