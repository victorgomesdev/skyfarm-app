import Theme from '@/constants/Theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <PaperProvider theme={Theme}>
      <StatusBar style="auto" backgroundColor={Theme.colors?.primary} />
      <SafeAreaView />
      <Stack screenOptions={{
        headerTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: Theme.colors?.primary
        }
      }}>
        <Stack.Screen name="webview" options={{
          headerTitle: "Definir área",
        }} />
      </Stack>
    </PaperProvider>
  );
}
