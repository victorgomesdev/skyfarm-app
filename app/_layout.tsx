import Theme from '@/constants/Theme';
import useAuth from '@/hooks/useAuth';
import SupabaseProvider from '@/shared/supabase';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  const { auth } = useAuth()

  useEffect(() => {
    async function doLogin() {

      const res = await auth?.signInWithPassword({
        email: "teste@teste.com",
        password: "123456",
      })

      if (res?.error) Alert.alert('erro', res.error.cause as string)
    }

    doLogin()
  }, [auth])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SupabaseProvider>
        <PaperProvider theme={Theme}>
          <Stack screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name='(tabs)' />
          </Stack>
        </PaperProvider>
        <StatusBar backgroundColor={Theme.colors?.primary} style='auto' />
      </SupabaseProvider>
    </SafeAreaView>
  );
}
