import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import Theme from '@/constants/Theme';
import SupabaseProvider from '@/shared/supabase';
import useAuth from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  const auth = useAuth()

  useEffect(() => {
    if (!auth) return
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
    <SafeAreaView style={{flex: 1}}>
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
